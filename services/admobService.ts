import { AdMob, InterstitialAdPluginEvents, AdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const isNative = () => {
    return Capacitor.isNativePlatform();
};

// Test IDs from Google
const INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

export const initializeAdMob = async () => {
    if (!isNative()) return;

    try {
        await AdMob.initialize({
            testingDevices: [],
        });
        console.log('AdMob initialized');
    } catch (e) {
        console.error('AdMob init failed', e);
    }
};

export const showInterstitialAd = async (): Promise<boolean> => {
    if (!isNative()) return true;

    return new Promise(async (resolve) => {
        try {
            const options: AdOptions = {
                adId: INTERSTITIAL_ID,
                isTesting: true,
            };

            await AdMob.prepareInterstitial(options);

            const adDismissedListener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
                console.log('Ad dismissed');
                adDismissedListener.remove();
                resolve(true);
            });

            const adFailedListener = await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (info: any) => {
                console.error('Ad failed to load', info);
                adFailedListener.remove();
                resolve(true); // Don't block user if ad fails
            });

            await AdMob.showInterstitial();
        } catch (e) {
            console.error('AdMob Interstitial failed', e);
            resolve(true);
        }
    });
};
