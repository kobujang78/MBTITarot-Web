import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] animate-fadeIn">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                {/* Decorative background glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                
                <div className="flex gap-4 items-start relative z-10">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Cookie className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-bold text-white">쿠키 사용 안내</h3>
                            <button onClick={handleAccept} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                            더 나은 사용자 경험과 맞춤형 광고(AdSense) 제공을 위해 쿠키를 사용합니다. 
                            본 서비스를 계속 이용하시려면 쿠키 사용에 동의해 주세요. 
                            자세한 내용은 <a href="#privacy" className="text-indigo-400 hover:underline">개인정보 처리방침</a>을 확인하세요.
                        </p>
                        <button 
                            onClick={handleAccept}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold rounded-lg transition-all shadow-lg active:scale-95"
                        >
                            동의하고 시작하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
