import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getUserProfile, handleDailyLoginReward, incrementVisitCount, registerUser } from '../services/userService';
import { UserProfile } from '../types';

const TWO_HOURS = 2 * 60 * 60 * 1000;
const PROFILE_POLL_INTERVAL = 30000;
const SESSION_CHECK_INTERVAL = 60000;

export const useUserSession = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const hasCountedVisit = useRef(false);
  const profileSubRef = useRef<any>(null);

  /**
   * Check if the custom 2-hour session timer has expired.
   * Returns true if expired (user is signed out), false otherwise.
   */
  const checkSessionExpiry = useCallback(async (): Promise<boolean> => {
    const loginTimeStr = localStorage.getItem('sessionLoginTime');
    if (!loginTimeStr) return false;

    const loginTime = parseInt(loginTimeStr, 10);
    if (Date.now() - loginTime > TWO_HOURS) {
      await supabase.auth.signOut();
      localStorage.removeItem('sessionLoginTime');
      alert("보안을 위해 세션이 만료되어 로그아웃되었습니다.");
      return true;
    }
    return false;
  }, []);

  /**
   * Loads the user profile, retrying once if the first attempt fails.
   * If no profile exists and user_metadata has nickname, auto-registers.
   */
  const loadUserProfile = useCallback(async (user: any): Promise<UserProfile | null> => {
    try {
      let profile = await getUserProfile(user.id);

      // If no profile but user has metadata from social login, auto-register
      if (!profile && user.user_metadata?.nickname) {
        try {
          const { nickname, mbti, referrer } = user.user_metadata;
          await registerUser(user.id, user.email || '', nickname, mbti || 'INFP', referrer);
          profile = await getUserProfile(user.id);
        } catch (e) {
          console.error("Auto-registration failed:", e);
        }
      }

      return profile;
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // Retry once after a short delay
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await getUserProfile(user.id);
      } catch (retryError) {
        console.error("Profile load retry also failed:", retryError);
        return null;
      }
    }
  }, []);

  /**
   * Subscribe to realtime profile changes for the given user.
   */
  const subscribeToProfileChanges = useCallback((userId: string) => {
    // Unsubscribe from any previous subscription
    if (profileSubRef.current) {
      profileSubRef.current.unsubscribe();
      profileSubRef.current = null;
    }

    profileSubRef.current = supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, async () => {
        try {
          const updatedProfile = await getUserProfile(userId);
          if (updatedProfile) setUserProfile(updatedProfile);
        } catch (e) {
          console.error("Realtime profile update failed:", e);
        }
      })
      .subscribe();
  }, []);

  // ─── Main Auth Listener ──────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      try {
        // First, try to get the existing session
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;

        if (!isMounted) return;

        if (user) {
          setCurrentUser(user);

          // Check if custom session timer has expired
          const expired = await checkSessionExpiry();
          if (expired || !isMounted) {
            setCurrentUser(null);
            setUserProfile(null);
            setIsSessionLoading(false);
            return;
          }

          // Set session login time if not already set
          if (!localStorage.getItem('sessionLoginTime')) {
            localStorage.setItem('sessionLoginTime', Date.now().toString());
          }

          // Load profile (with retry logic built-in)
          const profile = await loadUserProfile(user);
          if (!isMounted) return;

          if (profile) {
            setUserProfile(profile);
          }

          // Non-critical: daily login reward and visit count (fire and forget)
          handleDailyLoginReward(user.id).catch(e =>
            console.warn("Daily login reward failed (non-critical):", e)
          );

          if (!hasCountedVisit.current) {
            incrementVisitCount(user.id).catch(e =>
              console.warn("Visit count failed (non-critical):", e)
            );
            hasCountedVisit.current = true;
          }

          // Subscribe to realtime profile updates
          subscribeToProfileChanges(user.id);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          localStorage.removeItem('sessionLoginTime');
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        // ALWAYS set loading to false, regardless of success or failure
        if (isMounted) {
          setIsSessionLoading(false);
        }
      }
    };

    initializeSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        const user = session?.user ?? null;
        setCurrentUser(user);

        if (event === 'SIGNED_IN' && user) {
          // Set session login time
          localStorage.setItem('sessionLoginTime', Date.now().toString());

          // Load profile
          const profile = await loadUserProfile(user);
          if (!isMounted) return;

          if (profile) {
            setUserProfile(profile);
          }

          // Non-critical tasks
          handleDailyLoginReward(user.id).catch(e =>
            console.warn("Daily login reward failed:", e)
          );

          if (!hasCountedVisit.current) {
            incrementVisitCount(user.id).catch(e =>
              console.warn("Visit count failed:", e)
            );
            hasCountedVisit.current = true;
          }

          subscribeToProfileChanges(user.id);
          setIsSessionLoading(false);

        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          localStorage.removeItem('sessionLoginTime');
          hasCountedVisit.current = false;

          if (profileSubRef.current) {
            profileSubRef.current.unsubscribe();
            profileSubRef.current = null;
          }

          setIsSessionLoading(false);

        } else if (event === 'TOKEN_REFRESHED' && user) {
          // Token was refreshed - just make sure profile is loaded
          if (!userProfile) {
            const profile = await loadUserProfile(user);
            if (isMounted && profile) {
              setUserProfile(profile);
            }
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
      if (profileSubRef.current) {
        profileSubRef.current.unsubscribe();
        profileSubRef.current = null;
      }
    };
  }, []);

  // ─── Periodic Session Expiry Check ───────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      const expired = await checkSessionExpiry();
      if (expired) {
        setCurrentUser(null);
        setUserProfile(null);
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [currentUser, checkSessionExpiry]);

  // ─── Periodic Profile Refresh ────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      try {
        const profile = await getUserProfile(currentUser.id);
        if (profile) setUserProfile(profile);
      } catch (e) {
        console.warn("Periodic profile refresh failed:", e);
      }
    }, PROFILE_POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [currentUser]);

  return { currentUser, userProfile, setUserProfile, isSessionLoading };
};
