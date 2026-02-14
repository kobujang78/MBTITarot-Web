import React, { useRef, Suspense } from 'react';
import { AppStep, TarotCard } from './types';
import { APP_BACKGROUND_IMAGE_URL, MBTI_TYPES } from './constants';
import { getMoonData } from './services/astrologyService';
import { LogOut, User, X, FileText, ShieldCheck, AlertCircle, Home, Menu, Sparkles, History, ArrowLeft } from 'lucide-react';
import { supabase } from './services/supabase';

// Hooks
import { useUserSession } from './hooks/useUserSession';
import { useTarotSession } from './hooks/useTarotSession';
import { useTarotReading } from './hooks/useTarotReading';
import { useHistoryManager } from './hooks/useHistoryManager';
import { useUIState } from './hooks/useUIState';
import { useAudioEffects } from './hooks/useAudioEffects';
import { useShareManager } from './hooks/useShareManager';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useCommunityManager } from './hooks/useCommunityManager';

// Components
import GoogleAd from './components/GoogleAd';
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const BoardList = React.lazy(() => import('./components/BoardList'));
const PostEditor = React.lazy(() => import('./components/PostEditor'));
const PostDetail = React.lazy(() => import('./components/PostDetail'));
const MyPage = React.lazy(() => import('./components/MyPage'));
const TermsOfService = React.lazy(() => import('./notice/TermsOfService'));
const PrivacyPolicy = React.lazy(() => import('./notice/PrivacyPolicy'));
const LandingContent = React.lazy(() => import('./components/LandingContent'));
const MbtiAbout = React.lazy(() => import('./components/MbtiAbout'));
const TarotAbout = React.lazy(() => import('./components/TarotAbout'));

// Screens
import IntroScreen from './components/IntroScreen';
import HistoryScreen from './components/HistoryScreen';
import ShuffleScreen from './components/ShuffleScreen';
import SelectionScreen from './components/SelectionScreen';
import RevealScreen from './components/RevealScreen';
import ReadingScreen from './components/ReadingScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, isShareModalOpen, setIsShareModalOpen, activeNotice, setActiveNotice, isMenuOpen, setIsMenuOpen, viewingCard, setViewingCard, activeTooltipId, setActiveTooltipId, isRetryModalOpen, setIsRetryModalOpen, showSplash, setShowSplash, spreadError, setSpreadError } = useUIState();
  const { triggerFlipSound, triggerRotateSound } = useAudioEffects();
  const { currentUser, userProfile, setUserProfile, isSessionLoading } = useUserSession();
  const { step, setStep, question, setQuestion, selectedMbti, setSelectedMbti, selectedSpread, setSelectedSpread, deck, setDeck, selectedCards, setSelectedCards, startShuffling, handleCardSelect, resetApp } = useTarotSession(currentUser, userProfile, setUserProfile, setIsAuthModalOpen, triggerFlipSound);
  const [isHistoryMode, setIsHistoryMode] = React.useState(false);
  const { history, setHistory, historySort, setHistorySort, historySearch, setHistorySearch, expandedHistoryId, setExpandedHistoryId, filteredHistory, loadHistoryItem, deleteHistoryItem } = useHistoryManager(setStep, setQuestion, setSelectedMbti, setSelectedCards, (r) => { }, (m) => setIsHistoryMode(m));
  const { readingResult, setReadingResult, isLoading, readingSections, currentPage, setCurrentPage, getReading } = useTarotReading(question, selectedCards, selectedMbti, selectedSpread.name, userProfile?.nickname, setStep, setHistory);
  const { isCopied, shareToKakao, performShare } = useShareManager(readingResult, question, selectedSpread, selectedMbti, selectedCards);
  const { selectedPost, setSelectedPost, isPostEditorOpen, setIsPostEditorOpen, editingPost, setEditingPost, boardRefreshKey, setBoardRefreshKey } = useCommunityManager();

  useAppInitialization(setShowSplash);
  const readingRef = useRef<HTMLDivElement>(null);
  const moonData = getMoonData();

  // Handle incomplete profile for social login users
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isSessionLoading && currentUser && !userProfile && !isAuthModalOpen) {
      // Delay opening modal to allow for profile sync/creation latency
      timer = setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isSessionLoading, currentUser, userProfile, isAuthModalOpen]);

  // Auto-redirect to MyPage after login if the user was trying to access it
  React.useEffect(() => {
    if (currentUser && userProfile && isAuthModalOpen) {
      setIsAuthModalOpen(false);
      setStep(AppStep.MYPAGE);
    }
  }, [currentUser, userProfile, isAuthModalOpen]);

  const renderUserBadge = () => userProfile && (
    <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/5 shadow-lg">
      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20"><span className="text-sm">🔮</span><span className="text-[13px] font-bold text-indigo-200">{userProfile.crystals}개</span></div>
      <div className="flex items-center gap-1">
        <button onClick={() => setStep(AppStep.MYPAGE)} className="flex items-center gap-1 p-0.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 group"><User className="w-3.5 h-3.5 group-hover:text-indigo-400" /><span className="text-[13px] font-bold text-slate-300 truncate max-w-[80px]">{userProfile.nickname}님</span></button>
        <button onClick={() => supabase.auth.signOut()} className="p-0.5 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-slate-300"><LogOut className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );

  if (showSplash) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeIn"><img src="/intro-landing.jpg" alt="MBTI 타로운세" className="w-full h-full object-cover" /></div>;

  return (
    <div className="min-h-screen text-slate-200 overflow-x-hidden font-sans selection:bg-slate-600 selection:text-white relative">
      <div className="fixed inset-0 z-0 bg-cover bg-top bg-no-repeat bg-fixed" style={{ backgroundImage: `url('${APP_BACKGROUND_IMAGE_URL}')`, filter: 'contrast(1.1) brightness(0.9)' }}></div>
      <div className="fixed inset-0 z-0 bg-slate-950/45"></div>
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 mix-blend-screen opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" style={{ opacity: 0.3 + (moonData.intensity * 0.1) }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/20 rounded-full blur-[120px]" style={{ opacity: 0.3 + (moonData.intensity * 0.1) }}></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" style={{ opacity: 0.2 + (moonData.intensity * 0.2) }}></div>
      </div>


      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-2">
        {step === AppStep.INTRO && <IntroScreen userProfile={userProfile} selectedMbti={selectedMbti} setSelectedMbti={setSelectedMbti} selectedSpread={selectedSpread} setSelectedSpread={setSelectedSpread} question={question} setQuestion={setQuestion} setStep={setStep} setIsAuthModalOpen={setIsAuthModalOpen} startShuffling={startShuffling} openHistory={() => setStep(AppStep.HISTORY)} spreadError={spreadError} setSpreadError={setSpreadError} renderUserBadge={renderUserBadge} GoogleAd={GoogleAd} />}
        {step === AppStep.HISTORY && <HistoryScreen resetApp={resetApp} historySearch={historySearch} setHistorySearch={setHistorySearch} historySort={historySort} setHistorySort={setHistorySort} filteredHistory={filteredHistory} loadHistoryItem={loadHistoryItem} toggleHistoryExpand={(e, id) => setExpandedHistoryId(prev => prev === id ? null : id)} expandedHistoryId={expandedHistoryId} deleteHistoryItem={deleteHistoryItem} />}
        {step === AppStep.SHUFFLE && <ShuffleScreen />}
        {step === AppStep.SELECTION && <SelectionScreen selectedSpread={selectedSpread} selectedCards={selectedCards} activeTooltipId={activeTooltipId} setActiveTooltipId={setActiveTooltipId} deck={deck} handleCardSelect={handleCardSelect} triggerRotateSound={triggerRotateSound} />}
        {step === AppStep.REVEAL && <RevealScreen selectedSpread={selectedSpread} selectedCards={selectedCards} setViewingCard={setViewingCard} getReading={getReading} />}
        {step === AppStep.READING && <ReadingScreen isLoading={isLoading} selectedCards={selectedCards} setViewingCard={setViewingCard} moonData={moonData} selectedMbti={selectedMbti} readingSections={readingSections} currentPage={currentPage} setCurrentPage={setCurrentPage} isHistoryMode={isHistoryMode} selectedSpread={selectedSpread} question={question} readingRef={readingRef} shareToKakao={shareToKakao} performShare={performShare} openHistory={() => setStep(AppStep.HISTORY)} handleResetClick={resetApp} GoogleAd={GoogleAd} />}
        {step === AppStep.MYPAGE && (userProfile ? <MyPage userProfile={userProfile} onBack={() => setStep(AppStep.INTRO)} /> : (
          <div className="fixed inset-0 flex flex-col items-center justify-center text-white/70 z-20 gap-4">
            {isSessionLoading ? (
              <>
                <Sparkles className="w-8 h-8 animate-spin text-indigo-400" />
                <p>프로필을 불러오는 중입니다...</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <p>프로필을 불러올 수 없습니다.</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors">새로고침</button>
                  <button onClick={() => setStep(AppStep.INTRO)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">홈으로</button>
                </div>
              </>
            )}
          </div>
        ))}
        {step === AppStep.COMMUNITY && <div className="w-full max-w-4xl mx-auto pb-24"><div className="flex items-center gap-4 mb-6 px-4 pt-12"><button onClick={() => setStep(AppStep.INTRO)} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-xl font-bold text-white">커뮤니티</h2></div><BoardList key={boardRefreshKey} onPostClick={setSelectedPost} onWriteClick={() => currentUser ? setIsPostEditorOpen(true) : setIsAuthModalOpen(true)} /></div>}
        {step === AppStep.MBTI_ABOUT && <div className="w-full max-w-4xl mx-auto pb-24"><div className="flex items-center gap-4 mb-6 px-4 pt-12"><button onClick={() => setStep(AppStep.INTRO)} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-xl font-bold text-white">MBTI 가이드</h2></div><MbtiAbout /></div>}
        {step === AppStep.TAROT_ABOUT && <div className="w-full max-w-5xl mx-auto pb-24"><div className="flex items-center gap-4 mb-6 px-4 pt-12"><button onClick={() => setStep(AppStep.INTRO)} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-xl font-bold text-white">타로 가이드</h2></div><TarotAbout /></div>}
        {step === AppStep.SQUARE && <div className="w-full max-w-5xl mx-auto pb-24"><div className="flex items-center gap-4 mb-6 px-4 pt-12"><button onClick={() => setStep(AppStep.INTRO)} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-xl font-bold text-white">타로광장</h2></div><Suspense fallback={<div className="flex items-center justify-center p-20"><Sparkles className="w-8 h-8 animate-spin text-indigo-400" /></div>}><LandingContent /></Suspense></div>}
      </main>

      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setViewingCard(null)}>
          <div className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900"><div><h3 className="text-xl font-serif font-bold text-slate-200">{viewingCard.nameKo.split('(')[0].trim()}</h3><p className="text-xs text-slate-400 font-serif">{viewingCard.name}</p></div><button onClick={() => setViewingCard(null)} className="p-2 hover:bg-slate-700 rounded-full"><X className="w-5 h-5 text-slate-400" /></button></div>
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-800"><div className="w-full flex justify-center"><div className="w-48 h-80 rounded-lg shadow-lg overflow-hidden border border-slate-600 relative bg-slate-900"><img src={`/image/${String(viewingCard.id).padStart(2, '0')}.jpg`} alt={viewingCard.name} className="w-full h-full object-fill" /></div></div>
              <div className="space-y-4"><div className="bg-emerald-900/30 p-4 rounded-xl border border-emerald-800"><h4 className="text-emerald-400 font-bold mb-1 flex items-center gap-2">정방향</h4><p className="text-slate-300 text-sm">{viewingCard.meaningUp}</p></div><div className="bg-rose-900/30 p-4 rounded-xl border border-rose-800"><h4 className="text-rose-400 font-bold mb-1 flex items-center gap-2">역방향</h4><p className="text-slate-300 text-sm">{viewingCard.meaningRev}</p></div></div></div>
          </div>
        </div>
      )}

      {activeNotice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setActiveNotice(null)}>
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 sticky top-0 z-10"><div className="flex items-center gap-2">{activeNotice === 'tos' ? <FileText className="w-5 h-5 text-indigo-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}<h3 className="text-xl font-bold text-slate-200">{activeNotice === 'tos' ? '이용약관' : '개인정보 처리방침'}</h3></div><button onClick={() => setActiveNotice(null)} className="p-2 hover:bg-slate-700 rounded-full"><X className="w-5 h-5 text-slate-400" /></button></div>
            <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-800"><Suspense fallback={<div />} >{activeNotice === 'tos' ? <TermsOfService /> : <PrivacyPolicy />}</Suspense></div>
            <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-end"><button onClick={() => setActiveNotice(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">닫기</button></div>
          </div>
        </div>
      )}

      <Suspense fallback={<div className="fixed bottom-16 right-4 z-50 p-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg"><Sparkles className="w-5 h-5 text-slate-400 animate-spin" /></div>}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onShowNotice={setActiveNotice} />
        {userProfile && <PostEditor isOpen={isPostEditorOpen} onClose={() => { setIsPostEditorOpen(false); setEditingPost(null); }} userProfile={userProfile} editingPost={editingPost} onSuccess={() => setBoardRefreshKey(prev => prev + 1)} />}
        {selectedPost && <PostDetail post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} onEdit={(post) => { setEditingPost(post); setIsPostEditorOpen(true); setSelectedPost(null); }} onDeleteSuccess={() => setBoardRefreshKey(prev => prev + 1)} currentUser={currentUser} userProfile={userProfile} />}
      </Suspense>

      <footer className="w-full py-8 text-center z-20 mt-auto flex flex-col items-center gap-1.5 pb-20">
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4 text-[9px] text-slate-500 mb-2">{MBTI_TYPES.map(type => <a key={type} href="#mbti" className="hover:text-indigo-400 transition-colors uppercase">{type} 운세</a>)}</div>
        <div className="flex justify-center gap-4 text-white text-[10px] md:text-xs opacity-60">
          <button onClick={() => setActiveNotice('tos')} className="hover:opacity-100 transition-opacity">이용약관</button>
          <span className="opacity-30">|</span>
          <button onClick={() => setActiveNotice('privacy')} className="hover:opacity-100 transition-opacity">개인정보 처리방침</button>
        </div>
        <p className="text-white text-[9px] md:text-[11px] opacity-40">MBTI 타로운세 2026 / Powered by ⓒHongLabAI</p>
      </footer>

      <BottomNav
        currentStep={step}
        onStepChange={(newStep) => {
          console.log(`Nav changed to: ${newStep}, User: ${currentUser ? 'LoggedIn' : 'Guest'}`);
          if (newStep === AppStep.MYPAGE && !currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setStep(newStep);
          }
        }}
        isLoggedIn={!!currentUser}
      />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default App;
