import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { getUserProfile, handleDailyLoginReward, incrementVisitCount, registerUser } from '../services/userService';
import { UserProfile } from '../types';

export const useUserSession = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const hasCountedVisit = useRef(false);

  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      setCurrentUser(user);

      if (user) {
        const loginTimeStr = localStorage.getItem('sessionLoginTime');
        const now = Date.now();
        const TWO_HOURS = 2 * 60 * 60 * 1000;

        if (loginTimeStr) {
          const loginTime = parseInt(loginTimeStr, 10);
          if (now - loginTime > TWO_HOURS) {
            await supabase.auth.signOut();
            localStorage.removeItem('sessionLoginTime');
            alert("보안을 위해 세션이 만료되어 로그아웃되었습니다.");
            return;
          }
        } else if (!loginTimeStr) {
          localStorage.setItem('sessionLoginTime', now.toString());
        }

        await handleDailyLoginReward(user.id);

        if (!hasCountedVisit.current) {
          incrementVisitCount(user.id);
          hasCountedVisit.current = true;
        }

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

        if (profile) setUserProfile(profile);

        const profileSubscription = supabase
          .channel(`profile:${user.id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          }, async () => {
            const updatedProfile = await getUserProfile(user.id);
            if (updatedProfile) setUserProfile(updatedProfile);
          })
          .subscribe();

        return () => {
          profileSubscription.unsubscribe();
        };
      } else {
        localStorage.removeItem('sessionLoginTime');
        setUserProfile(null);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      const loginTimeStr = localStorage.getItem('sessionLoginTime');
      if (loginTimeStr) {
        const loginTime = parseInt(loginTimeStr, 10);
        if (Date.now() - loginTime > 2 * 60 * 60 * 1000) {
          supabase.auth.signOut();
          localStorage.removeItem('sessionLoginTime');
          alert("보안을 위해 세션이 만료되었습니다. 다시 로그인해 주세요.");
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      getUserProfile(currentUser.id).then(p => {
        if (p) setUserProfile(p);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  return { currentUser, userProfile, setUserProfile };
};
