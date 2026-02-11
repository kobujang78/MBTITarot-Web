import React, { useRef, useEffect } from 'react';
import { MBTI_TYPES, TAROT_SPREADS } from '../constants';
import { UserProfile, AppStep, TarotSpread } from '../types';
import Button from './Button';
import { Download, MessageSquare, LogIn, History, Sparkles, Lock, AlertCircle, Menu } from 'lucide-react';

interface IntroScreenProps {
  userProfile: UserProfile | null;
  selectedMbti: string;
  setSelectedMbti: (mbti: string) => void;
  selectedSpread: TarotSpread;
  setSelectedSpread: (spread: TarotSpread) => void;
  question: string;
  setQuestion: (q: string) => void;
  setStep: (step: AppStep) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  startShuffling: () => void;
  openHistory: () => void;
  spreadError: string | null;
  setSpreadError: (err: string | null) => void;
  renderUserBadge: () => React.ReactNode;
  GoogleAd: React.FC<{ type?: 'inline' | 'side' }>;
  LandingContent: React.ComponentType;
}

const IntroScreen: React.FC<IntroScreenProps> = ({
  userProfile, selectedMbti, setSelectedMbti, selectedSpread, setSelectedSpread,
  question, setQuestion, setStep, setIsAuthModalOpen, startShuffling, openHistory,
  spreadError, setSpreadError, renderUserBadge, GoogleAd, LandingContent
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: wheelRef.current,
      threshold: 0.5,
      rootMargin: '0px -40% 0px -40%'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const type = entry.target.getAttribute('data-type');
          if (type) setSelectedMbti(type);
        }
      });
    }, observerOptions);

    const items = wheelRef.current?.querySelectorAll('.mbti-wheel-item');
    items?.forEach(item => observer.observe(item));

    if (!selectedMbti || selectedMbti === '공통') {
      const istjElement = wheelRef.current?.querySelector('[data-type="ISTJ"]');
      if (istjElement) {
        istjElement.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
      }
    }

    return () => observer.disconnect();
  }, [setSelectedMbti, selectedMbti]);

  return (
    <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn max-w-6xl px-2 relative w-full pt-1 pb-32">
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-3 z-30 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 text-xs font-bold text-slate-400">
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">소개</a>
            <button onClick={() => setStep(AppStep.MBTI_ABOUT)} className="hover:text-white transition-colors">MBTI란?</button>
            <button onClick={() => setStep(AppStep.TAROT_ABOUT)} className="hover:text-white transition-colors">타로란?</button>
            <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">FAQ</a>
            <button onClick={() => setStep(AppStep.COMMUNITY)} className="hover:text-white transition-colors">커뮤니티</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setStep(AppStep.COMMUNITY)} className="md:hidden flex items-center gap-1 text-slate-300 text-xs font-bold">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <h1 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-sky-200 to-slate-200 animate-shimmer mt-10 md:mt-14 drop-shadow-lg font-bold">
        MBTI 타로운세
      </h1>

      <div className={`w-full max-w-lg flex flex-col items-center justify-center transition-all ${userProfile ? 'min-h-[70px] mt-12 md:mt-16 mb-0' : 'min-h-[120px] mt-12 md:mt-16'}`}>
        {userProfile ? (
          <div className="flex flex-col items-center animate-fadeIn py-1">
            <label className="block text-white text-sm md:text-base mb-2 font-medium">시스템이 분석한 당신의 성향</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-full blur opacity-75 transition duration-1000"></div>
              <div className="relative px-5 py-1 bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-full shadow-lg">
                <span className="text-lg md:text-xl font-black font-serif bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">{userProfile.mbti}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <label className="block text-white text-sm md:text-base mb-2 font-medium">당신의 MBTI를 선택해 주세요.</label>
            <div className="mbti-wheel-container">
              <div className="selection-indicator"></div>
              <div ref={wheelRef} className="mbti-wheel">
                <div className="mbti-wheel-spacer"></div>
                {MBTI_TYPES.map((type) => (
                  <div key={type} data-type={type} onClick={() => document.querySelector(`[data-type="${type}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                    className={`mbti-wheel-item cursor-pointer text-xl font-bold font-serif ${selectedMbti === type ? 'active text-white' : 'text-slate-500 opacity-50'}`}>
                    {type}
                  </div>
                ))}
                <div className="mbti-wheel-spacer"></div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-lg mt-2 md:mt-4 relative z-20" id="tarot">
        <label className="block text-white text-xs md:text-sm mb-1.5 font-medium opacity-80">오늘은 어떤 운세가 궁금한가요?</label>
        <div className="grid grid-cols-3 gap-1.5 px-0">
          {Object.values(TAROT_SPREADS).map((spread) => (
            <button key={spread.id} onClick={() => {
              if (!userProfile && spread.id !== 'TODAY') {
                setSpreadError('다른 운세는 회원가입 후에 확인이 가능합니다.');
                setTimeout(() => setSpreadError(null), 3000);
                setIsAuthModalOpen(true);
                return;
              }
              setSpreadError(null);
              setSelectedSpread(spread);
            }}
              className={`px-1 py-1.5 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center gap-0.5 ${selectedSpread.id === spread.id ? 'bg-slate-100 text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] transform scale-105' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'} ${!userProfile && spread.id !== 'TODAY' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-bold">{spread.name}</span>
                {!userProfile && spread.id !== 'TODAY' && <Lock className="w-2.5 h-2.5 opacity-50" />}
              </div>
              <span className={`text-[9px] font-medium ${selectedSpread.id === spread.id ? 'text-slate-600' : 'text-slate-500'}`}>
                {spread.id === 'NEW_YEAR' ? `수정구슬 ${spread.cardCount}개` : '무료'}
              </span>
            </button>
          ))}
        </div>
        {spreadError && <div className="mt-2 text-center animate-bounce"><p className="text-[11px] text-rose-400 font-medium flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {spreadError}</p></div>}
      </div>

      <div className="flex flex-row justify-between items-start gap-2 w-full">
        <GoogleAd type="side" />
        <div className="flex flex-col items-center text-center space-y-2 max-w-lg px-2 w-full mx-auto">
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-400 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 flex flex-col items-center shadow-lg transition-all focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400">
              <input type="text" placeholder="상세한 운세가 궁금하면 직접 입력해주세요" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-transparent border-none focus:outline-none text-slate-200 placeholder-slate-500 text-center text-sm px-3 py-1" />
              <p className="text-[10px] text-slate-500 italic mt-1">수정구슬 5개가 추가 소모됩니다.</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full px-1">
            <Button onClick={startShuffling} disabled={!selectedMbti} className={`flex items-center justify-center gap-1 group flex-1 py-3 !px-0.5 !font-sans !tracking-normal ${!selectedMbti ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin shrink-0" />
              <span className="text-[13px] font-bold whitespace-nowrap">{selectedMbti ? '운명의 카드 섞기' : 'MBTI 선택 필요'}</span>
            </Button>
            <Button onClick={openHistory} variant="secondary" className="flex items-center justify-center gap-1 bg-slate-800/80 border-slate-700 text-slate-300 flex-1 py-3 !px-0.5 !font-sans !tracking-normal">
              <History className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[13px] font-bold whitespace-nowrap">운명의 기록</span>
            </Button>
          </div>
        </div>
        <GoogleAd type="side" />
      </div>
      <div id="about"><LandingContent /></div>
      <div className="pb-4"></div>
    </div>
  );
};

export default IntroScreen;
