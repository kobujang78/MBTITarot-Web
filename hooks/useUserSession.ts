import { useState, useEffect, useRef, useCallback } from 'react';
import { App } from '@capacitor/app';
import { supabase } from '../services/supabase';
import { getUserProfile, handleDailyLoginReward, incrementVisitCount, registerUser } from '../services/userService';
import { UserProfile } from '../types';

const PROFILE_POLL_INTERVAL = 30000;

export const useUserSession = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const hasCountedVisit = useRef(false);
  const profileSubRef = useRef<any>(null);

  /**
   * Signs out the user and cleans up the session state.
   */
  const handleForcedLogout = useCallback(async () => {
    // Only act if there is a current user to log out
    if (!currentUser) return;

    try {
      // Double check session before signing out
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setUserProfile(null);
        sessionStorage.removeItem('sessionLoginTime');
        console.log("Session cleared due to app backgrounding or closure.");
      }
    } catch (e) {
      console.error("Forced logout failed:", e);
    }
  }, [currentUser]);

  /**
   * Loads the user profile, retrying once if the first attempt fails.
   */
  const loadUserProfile = useCallback(async (user: any): Promise<UserProfile | null> => {
    try {
      let profile = await getUserProfile(user.id);

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
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await getUserProfile(user.id);
      } catch (retryError) {
        console.error("Profile load retry also failed:", retryError);
        return null;
      }
    }
  }, []);

  const subscribeToProfileChanges = useCallback((userId: string) => {
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

  // ─── Main Session Logic ──────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    // Handler for app backgrounding (Capacitor)
    const appStateListener = App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        console.log("App moved to background. Triggering logout as requested.");
        handleForcedLogout();
      }
    });

    // Handler for browser visibility change (Web)
    const visibilityListener = () => {
      if (document.visibilityState === 'hidden') {
        console.log("Tab hidden. Triggering logout.");
        handleForcedLogout();
      }
    };
    document.addEventListener('visibilitychange', visibilityListener);

    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;

        if (!isMounted) return;

        if (user) {
          setCurrentUser(user);

          if (!sessionStorage.getItem('sessionLoginTime')) {
            sessionStorage.setItem('sessionLoginTime', Date.now().toString());
          }

          const profile = await loadUserProfile(user);
          if (isMounted && profile) {
            setUserProfile(profile);
          }

          handleDailyLoginReward(user.id).catch(e => console.warn(e));

          if (!hasCountedVisit.current) {
            incrementVisitCount(user.id).catch(e => console.warn(e));
            hasCountedVisit.current = true;
          }

          subscribeToProfileChanges(user.id);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          sessionStorage.removeItem('sessionLoginTime');
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        if (isMounted) setIsSessionLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        const user = session?.user ?? null;
        setCurrentUser(user);

        if (event === 'SIGNED_IN' && user) {
          sessionStorage.setItem('sessionLoginTime', Date.now().toString());
          const profile = await loadUserProfile(user);
          if (isMounted && profile) setUserProfile(profile);
          handleDailyLoginReward(user.id).catch(e => console.warn(e));
          if (!hasCountedVisit.current) {
            incrementVisitCount(user.id).catch(e => console.warn(e));
            hasCountedVisit.current = true;
          }
          subscribeToProfileChanges(user.id);
          setIsSessionLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          sessionStorage.removeItem('sessionLoginTime');
          hasCountedVisit.current = false;
          if (profileSubRef.current) {
            profileSubRef.current.unsubscribe();
            profileSubRef.current = null;
          }
          setIsSessionLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
      appStateListener.then(l => l.remove());
      document.removeEventListener('visibilitychange', visibilityListener);
      if (profileSubRef.current) {
        profileSubRef.current.unsubscribe();
        profileSubRef.current = null;
      }
    };
  }, [handleForcedLogout, loadUserProfile, subscribeToProfileChanges]);

  // ─── Periodic Session Expiry Check ───────────────────────────
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
