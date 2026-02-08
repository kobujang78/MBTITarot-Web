export { };

declare global {
    interface Window {
        adsbygoogle: any[];
        Kakao: any;
        Capacitor?: {
            isNative?: boolean;
            platform?: string;
        };
    }
}
