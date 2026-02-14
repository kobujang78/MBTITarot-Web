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
  const isMountedRef = useRef(true);

  // Keep currentUser in a ref for use in event listeners without dependency issues
  const currentUserRef = useRef<any>(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  /**
   * Signs out the user and cleans up the session state.
   */
  const handleForcedLogout = useCallback(async () => {
    // Only act if there is a current user to log out
    if (!currentUserRef.current) return;

    try {
      console.log("Forcing logout due to app backgrounding or closure...");
      await supabase.auth.signOut();
      if (isMountedRef.current) {
        setCurrentUser(null);
        setUserProfile(null);
      }
    } catch (e) {
      console.error("Forced logout failed:", e);
    }
  }, []);

  /**
   * Loads the user profile, retrying once if the first attempt fails.
   */
  const loadProfile = useCallback(async (user: any) => {
    if (!user) return null;
    try {
      let profile = await getUserProfile(user.id);

      // Auto-register if user metadata exists but profile doesn't
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
    } catch (e) {
      console.error("Profile load error:", e);
      return null;
    }
  }, []);

  const subscribeToProfile = useCallback((userId: string) => {
    if (profileSubRef.current) {
      profileSubRef.current.unsubscribe();
    }

    profileSubRef.current = supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, async () => {
        const updated = await getUserProfile(userId);
        if (isMountedRef.current && updated) setUserProfile(updated);
      })
      .subscribe();
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // 1. App State & Visibility Listeners for auto-logout
    const appStateListener = App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) handleForcedLogout();
    });

    const visibilityListener = () => {
      if (document.visibilityState === 'hidden') handleForcedLogout();
    };
    document.addEventListener('visibilitychange', visibilityListener);

    // 2. Initialize Session
    const init = async () => {
      setIsSessionLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;

        if (!isMountedRef.current) return;
        setCurrentUser(user);

        if (user) {
          const profile = await loadProfile(user);
          if (isMountedRef.current) {
            setUserProfile(profile);
            if (profile) {
              handleDailyLoginReward(user.id).catch(() => { });
              if (!hasCountedVisit.current) {
                incrementVisitCount(user.id).catch(() => { });
                hasCountedVisit.current = true;
              }
              subscribeToProfile(user.id);
            }
          }
        }
      } catch (e) {
        console.error("Init session error:", e);
      } finally {
        if (isMountedRef.current) setIsSessionLoading(false);
      }
    };

    init();

    // 3. Auth Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      if (!isMountedRef.current) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setCurrentUser(user);
        const profile = await loadProfile(user);
        if (isMountedRef.current) {
          setUserProfile(profile);
          if (profile && user) {
            subscribeToProfile(user.id);
          }
          setIsSessionLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUserProfile(null);
        hasCountedVisit.current = false;
        if (profileSubRef.current) profileSubRef.current.unsubscribe();
        setIsSessionLoading(false);
      } else if (event === 'INITIAL_SESSION') {
        // Handled by init() but good to have as backup
        if (user && !currentUserRef.current) {
          setCurrentUser(user);
          const profile = await loadProfile(user);
          if (isMountedRef.current) setUserProfile(profile);
        }
      }
    });

    return () => {
      isMountedRef.current = false;
      appStateListener.then(l => l.remove());
      document.removeEventListener('visibilitychange', visibilityListener);
      subscription.unsubscribe();
      if (profileSubRef.current) profileSubRef.current.unsubscribe();
    };
  }, [handleForcedLogout, loadProfile, subscribeToProfile]);

  // Periodic Refresh
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(async () => {
      try {
        const p = await getUserProfile(currentUser.id);
        if (isMountedRef.current && p) setUserProfile(p);
      } catch { }
    }, PROFILE_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [currentUser]);

  return { currentUser, userProfile, setUserProfile, isSessionLoading };
};
