import React from 'react';
import { Home, Sparkles, History, User } from 'lucide-react';
import { AppStep } from '../types';

interface BottomNavProps {
    currentStep: AppStep;
    onStepChange: (step: AppStep) => void;
    isLoggedIn: boolean;
    isAdmin?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentStep, onStepChange, isLoggedIn }) => {
    const navItems = [
        { id: AppStep.INTRO, label: '홈', icon: Home },
        { id: AppStep.COMMUNITY, label: '타로상담', icon: Sparkles },
        { id: AppStep.HISTORY, label: '운명의 기록', icon: History },
        { id: AppStep.MYPAGE, label: isLoggedIn ? '마이페이지' : '로그인', icon: User },
    ];

    const handleNavClick = (id: AppStep) => {
        onStepChange(id);
        if (id === AppStep.INTRO) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isActive = (id: AppStep) => {
        return currentStep === id;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] pb-safe">
            {/* Background with Glassmorphism */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"></div>

            <div className="relative max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
                {navItems.map((item) => {
                    const ActiveIcon = item.icon;
                    const active = isActive(item.id);

                    return (
                        <button
                            key={item.label}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative group ${active ? 'text-white scale-105' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {/* Active Indicator Glow */}
                            {active && (
                                <div className="absolute -top-1 w-10 h-10 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                            )}

                            <div className={`relative z-10 p-1 rounded-xl transition-all duration-300 ${active ? 'bg-indigo-600/20 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'group-hover:bg-white/5'
                                }`}>
                                <ActiveIcon
                                    className={`w-5 h-5 transition-transform duration-300 ${active ? 'stroke-[2.5px]' : 'stroke-[1.5px] group-hover:scale-110'
                                        }`}
                                />
                            </div>

                            <span className={`text-[9px] font-bold tracking-tight transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                                }`}>
                                {item.label}
                            </span>

                            {/* Bottom Dot Indicator */}
                            {active && (
                                <div className="absolute -bottom-0.5 w-0.5 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
