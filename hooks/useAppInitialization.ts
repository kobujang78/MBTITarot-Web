import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';
import { initializeAdMob } from '../services/admobService';
import { supabase } from '../services/supabase';

export const useAppInitialization = (setShowSplash: (show: boolean) => void) => {
  useEffect(() => {
    // 1. Initialize Kakao
    if (typeof window !== 'undefined' && (window as any).Kakao && !(window as any).Kakao.isInitialized()) {
      const KAKAO_KEY = '0398256e094e7a60932217b241aafdd6';
      try {
        (window as any).Kakao.init(KAKAO_KEY);
      } catch (e) {
        console.error("Kakao Init Failed", e);
      }
    }

    // 2. Initialize AdMob
    initializeAdMob();

    // 3. Deep Link Handler for Supabase Auth (Capacitor)
    const handleDeepLink = async () => {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = new URL(event.url);

        // Check if the URL contains authentication parameters
        if (url.hash.includes('access_token') || url.searchParams.has('access_token')) {
          const { error } = await supabase.auth.getSession(); // Let Supabase handle the URL automatically if possible, or...

          // Ideally, Supabase JS automatically detects window.location changes.
          // However, for Capacitor, we might need to manually set the session if the URL doesn't update window.location.
          // But typically, simply navigating or ensuring the URL is processed by the internal listener is enough.
          // A more robust manual approach:

          const params = new URLSearchParams(url.hash.substring(1)); // Remove '#'
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) console.error("Deep link session restore failed:", error);
          }
        }
      });
    };
    handleDeepLink();

    // 4. Splash screen timer
    const timer = setTimeout(() => {
      // ... existing timer logic ...
      setShowSplash(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      CapacitorApp.removeAllListeners();
    };
  }, [setShowSplash]);
};
