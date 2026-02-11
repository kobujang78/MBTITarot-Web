import { useEffect } from 'react';
import { initializeAdMob } from '../services/admobService';

export const useAppInitialization = (setShowSplash: (show: boolean) => void) => {
  useEffect(() => {
    // Initialize Kakao SDK
    if (typeof window !== 'undefined' && (window as any).Kakao && !(window as any).Kakao.isInitialized()) {
      const KAKAO_KEY = '0398256e094e7a60932217b241aafdd6';
      try {
        (window as any).Kakao.init(KAKAO_KEY);
      } catch (e) {
        console.error("Kakao Init Failed", e);
      }
    }

    // Initialize AdMob
    initializeAdMob();

    // Splash screen timer
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setShowSplash]);
};
