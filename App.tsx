import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { AppStep, SelectedCard, TarotCard, SavedReading, TarotSpread } from './types';
import { ALL_CARDS, CARD_BACK_IMAGE_URL, MBTI_TYPES, APP_BACKGROUND_IMAGE_URL, TAROT_SPREADS } from './constants';
import { getTarotReading } from './services/geminiService';
import { saveReadingToStorage, getReadingsFromStorage, deleteReadingFromStorage } from './services/storageService';
import { getMoonData } from './services/astrologyService';
import CardCarousel from './components/CardCarousel';
import Button from './components/Button';
import { handleDailyLoginReward, deductCrystal, incrementVisitCount } from './services/userService';
import { LogOut, ChevronRight, ChevronLeft, ArrowLeft, RefreshCw, Sparkles, Check, Share2, Calendar, X, Trash2, ChevronDown, ChevronUp, BookOpen, User, Lock, AlertCircle, Moon, Stars, ArrowUp, RotateCcw, History, Search, Info, ShieldCheck, FileText, LogIn, MessageSquare, Download, Home, Menu } from 'lucide-react';
import { supabase } from './services/supabase';
import { getUserProfile } from './services/userService';
import { Post, UserProfile } from './types';
import { initializeAdMob, showInterstitialAd } from './services/admobService';

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

// AdSense Component
const GoogleAd: React.FC<{ type?: 'inline' | 'side' }> = ({ type = 'inline' }) => {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense push failed', e);
    }
  }, []);

  if (type === 'side') {
    return (
      <div className="w-[160px] h-[600px] bg-black/20 border border-white/5 rounded-lg overflow-hidden hidden xl:block sticky top-24">
        <ins className="adsbygoogle"
          style={{ display: 'inline-block', width: '160px', height: '600px' }}
          data-ad-client="ca-pub-5062970718213147"
          data-ad-slot="auto"
          data-ad-format="vertical"
          data-full-width-responsive="false"></ins>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto my-4 overflow-hidden rounded-xl border border-white/5 bg-black/20">
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5062970718213147"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

// Kakao SDK Type Definition
declare global {
  interface Window {
    Kakao: any;
  }
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const [question, setQuestion] = useState('');
  const [selectedMbti, setSelectedMbti] = useState<string>(''); // MBTI State
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread>(TAROT_SPREADS.TODAY);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [readingResult, setReadingResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SavedReading[]>([]);
  const [isHistoryMode, setIsHistoryMode] = useState(false); // Track if we are viewing a past reading
  const [isCopied, setIsCopied] = useState(false); // Track copy state for share button
  const [showSplash, setShowSplash] = useState(true); // Splash screen state
  const [activeNotice, setActiveNotice] = useState<'tos' | 'privacy' | null>(null); // Notice modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Share options modal state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auth & Profile State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const hasCountedVisit = useRef(false);

  // Community State
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [boardRefreshKey, setBoardRefreshKey] = useState(0);

  // History Filter & Sort States
  const [historySort, setHistorySort] = useState<'newest' | 'oldest'>('newest');
  const [historySearch, setHistorySearch] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Tooltip State for Selection Screen
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);
  const [spreadError, setSpreadError] = useState<string | null>(null);

  // Card Detail Modal State
  const [viewingCard, setViewingCard] = useState<TarotCard | null>(null);

  // Pagination State for Reading
  const [currentPage, setCurrentPage] = useState(0);
  const [isQuestionFeeDeducted, setIsQuestionFeeDeducted] = useState(false);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);

  // Refs for scrolling and audio
  const readingRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Calculated Moon Data
  const moonData = getMoonData();

  // Load history on mount & Initialize Kakao
  useEffect(() => {
    // Initialize Kakao SDK
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      const KAKAO_KEY = '0398256e094e7a60932217b241aafdd6';
      try {
        window.Kakao.init(KAKAO_KEY);
      } catch (e) {
        console.error("Kakao Init Failed", e);
      }
    }

    // Initialize AdMob
    initializeAdMob();

    setHistory(getReadingsFromStorage());


    // Listen to Auth State
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      setCurrentUser(user);

      if (user) {
        // --- Absolute Session Timeout (2 Hours) ---
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

        // Handle daily login reward
        const rewarded = await handleDailyLoginReward(user.id);
        if (rewarded) {
          console.log("Daily login reward granted!");
        }

        // Increment visit count once per session load
        if (!hasCountedVisit.current) {
          incrementVisitCount(user.id);
          hasCountedVisit.current = true;
        }

        // Initial profile fetch
        const profile = await getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
        }

        // Listen to User Profile Changes (Crystals, etc.)
        const profileSubscription = supabase
          .channel(`profile:${user.id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          }, async () => {
            const updatedProfile = await getUserProfile(user.id);
            if (updatedProfile) {
              setUserProfile(updatedProfile);
            }
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

    return () => {
      authSubscription.unsubscribe();
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => { });
    };
  }, []);

  // background session timeout check
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

  // Sync selectedMbti with userProfile
  useEffect(() => {
    if (userProfile?.mbti) {
      setSelectedMbti(userProfile.mbti);
    }
  }, [userProfile]);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash for 2 seconds

    // Preload critical assets
    const criticalAssets = [
      APP_BACKGROUND_IMAGE_URL,
      CARD_BACK_IMAGE_URL,
      ...MBTI_TYPES.map(m => `/image/${m}.jpg`).slice(0, 4) // Preload a few MBTI images
    ];

    criticalAssets.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh profile every 30 seconds to keep crystal count in sync
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      getUserProfile(currentUser.id).then(p => {
        if (p) setUserProfile(p);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Handle URL query parameters for external navigation (e.g. from MBTI test) & Deep Links
  useEffect(() => {
    // 1. Handle Web Params
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('signup') === 'true') {
      setIsAuthModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }

    // 2. Handle Native Deep Links (Capacitor)
    if (window.Capacitor?.isNative) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('appUrlOpen', async (data) => {
          console.log('App opened with URL:', data.url);
          // Supabase handles the session exchange automatically if the URL fragment contains access_token
          // But we need to ensure the URL is processed by Supabase client
          if (data.url.includes('access_token') || data.url.includes('refresh_token')) {
            // Extract the fragment and manually set session if needed, 
            // or let supabase.auth.getSession() pick it up if it persists in local storage via the browser intent.
            // A more robust way for Supabase + Capacitor:
            try {
              const url = new URL(data.url);
              const params = new URLSearchParams(url.hash.substring(1)); // Hashes are usually where tokens are
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');

              if (accessToken && refreshToken) {
                await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                // Force reload user
                const { data: { user } } = await supabase.auth.getUser();
                if (user) setCurrentUser(user);
              }
            } catch (e) {
              console.error("Deep link auth error:", e);
            }
          }
        });
      });
    }
  }, []);



  // Intersection Observer for MBTI Wheel
  useEffect(() => {
    if (step !== AppStep.INTRO || showSplash) return;

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

    const timer = setTimeout(() => {
      const items = wheelRef.current?.querySelectorAll('.mbti-wheel-item');
      items?.forEach(item => observer.observe(item));

      // Auto-scroll to ISTJ on initial load if no MBTI is selected or if it's '공통' (to maintain previous behavior)
      if (!selectedMbti || selectedMbti === '공통') {
        const istjElement = wheelRef.current?.querySelector('[data-type="ISTJ"]');
        if (istjElement) {
          istjElement.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [step, showSplash]);

  // Parse Reading Result into Sections
  const readingSections = useMemo(() => {
    if (!readingResult) return [];
    // Split by headers starting with ###
    const rawSections = readingResult.split(/(?=### )/g);
    const parsedSections = rawSections.map(section => {
      const lines = section.trim().split('\n');
      if (lines.length === 0) return null;

      const titleLine = lines[0];
      // Only treat as section if it starts with ###
      if (!titleLine.startsWith('### ')) return null;

      const title = titleLine.replace(/^### /, '').trim();
      const content = lines.slice(1).join('\n').trim();

      return { title, content };
    }).filter((s): s is { title: string; content: string } => s !== null && (!!s.title || !!s.content));

    if (parsedSections.length > 0) {
      const tocContent = parsedSections.map((s, idx) => `* chapter_link:${idx + 1}:${s.title}`).join('\n');
      return [
        {
          title: "📖 타로풀이 결과 📖",
          content: `당신을 위해 준비된 타로풀이의 순서입니다. 궁금한 장을 선택하거나 아래의 '다음' 버튼을 눌러 여정을 시작하세요.\n\n${tocContent}`
        },
        ...parsedSections
      ];
    }
    return parsedSections;
  }, [readingResult]);

  // Reset page on new reading
  useEffect(() => {
    if (readingResult) setCurrentPage(0);
  }, [readingResult]);

  // Filter and Sort History Logic
  const filteredHistory = React.useMemo(() => {
    let result = [...history];

    // Filter by search query
    if (historySearch.trim()) {
      const query = historySearch.toLowerCase();
      result = result.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.cards.some(c => c.nameKo.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)) ||
        (item.mbti && item.mbti.toLowerCase().includes(query))
      );
    }

    // Sort by date
    result.sort((a, b) => {
      if (historySort === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });

    return result;
  }, [history, historySearch, historySort]);

  // --- DECK LOGIC ---
  const finalizeShuffle = useCallback(() => {
    // Fisher-Yates shuffle
    const shuffled = [...ALL_CARDS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
    setSelectedCards([]);
    setActiveTooltipId(null);
    setStep(AppStep.SELECTION);
  }, []);

  const startShuffling = useCallback(() => {
    // 1. Calculate total expected cost
    const isToday = selectedSpread.id === 'TODAY';
    const isNewYear = selectedSpread.id === 'NEW_YEAR';
    const hasSpecificQuestion = question.trim().length > 0;

    // Use crystals only for New Year or specific questions
    const spreadCost = isNewYear ? selectedSpread.cardCount : 0;
    const questionFee = hasSpecificQuestion ? 5 : 0;
    const totalExpectedCost = spreadCost + questionFee;

    // Login logic: Today's fortune without a question is the only guest-allowed action
    const loginRequired = !isToday || hasSpecificQuestion;

    // Reset question fee deduction status for the new session
    setIsQuestionFeeDeducted(false);

    if (loginRequired) {
      // Check for login
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }

      // Check for sufficient crystals (total expected)
      if (totalExpectedCost > 0 && (!userProfile || userProfile.crystals < totalExpectedCost)) {
        let message = `수정구슬이 부족합니다. (필요: ${totalExpectedCost}개)`;
        if (hasSpecificQuestion && isNewYear) {
          message = `구체적인 질문을 포함한 신년운세 풀이에는 총 ${totalExpectedCost}개의 수정구슬이 필요합니다.\n현재 보유 수정구슬이 부족합니다.`;
        }
        alert(message);
        return;
      }
    }

    setIsHistoryMode(false);
    setStep(AppStep.SHUFFLE);
    // Let animation play for 3 seconds before moving to selection
    setTimeout(() => {
      finalizeShuffle();
    }, 3000);
  }, [selectedSpread, question, finalizeShuffle, currentUser, userProfile]);

  const triggerFlipSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioCtxRef.current = new AudioContext();
        }
      }

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.25; // Slightly longer for "flip" feel

      // Noise generator for paper rustle
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter: Lowpass with a slight sweep to simulate movement
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration);
      filter.Q.value = 0.7;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      // Gentler attack (0.03s instead of 0.005s) for "paper" sound
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (error) {
      console.error("Audio play failed", error);
    }
  };

  const triggerRotateSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const duration = 0.15; // Slightly longer for better presence

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + duration);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02); // Slightly softer
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (error) {
      console.error("Audio play failed", error);
    }
  };


  const isProcessingRef = useRef(false);

  const handleCardSelect = useCallback(async (card: TarotCard, index: number) => {
    if (isProcessingRef.current) return;
    if (selectedCards.length >= selectedSpread.cardCount) return;

    // Check if card is already selected
    if (selectedCards.some(c => c.id === card.id)) return;

    // 1. Calculate costs
    const isToday = selectedSpread.id === 'TODAY';
    const isNewYear = selectedSpread.id === 'NEW_YEAR';
    const hasSpecificQuestion = question.trim().length > 0;
    const needsQuestionFee = hasSpecificQuestion && !isQuestionFeeDeducted;

    // Only NEW_YEAR or Additional Question costs crystals
    const currentStepCost = (isNewYear ? 1 : 0) + (needsQuestionFee ? 5 : 0);
    const loginRequired = !isToday || hasSpecificQuestion;

    // 2. Check login for required actions
    if (loginRequired) {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
    }

    // 3. Check and deduct crystals if cost > 0
    if (currentStepCost > 0) {

      if (!userProfile || userProfile.crystals < currentStepCost) {
        const message = needsQuestionFee
          ? `추가 질문을 포함한 이번 카드 선택에는 총 ${currentStepCost}개의 수정구슬이 필요합니다.`
          : `이번 카드 선택에는 1개의 수정구슬이 필요합니다.`;
        alert(message);
        return;
      }

      // 4. Actually deduct crystals
      isProcessingRef.current = true;
      console.log(`[Crystal] Attempting deduction. User: ${currentUser.id}, Amount: ${currentStepCost}, Current Balance: ${userProfile?.crystals}`);

      // Strict Check: Refresh profile to ensure client has latest data
      const freshProfile = await getUserProfile(currentUser.id);
      if (!freshProfile || freshProfile.crystals < currentStepCost) {
        alert(`수정구슬이 부족합니다.\n(현재: ${freshProfile?.crystals ?? 0}개, 필요: ${currentStepCost}개)\n[Debug: UID=${currentUser.id.substring(0, 8)}...]`);
        isProcessingRef.current = false;
        // Update local state to match reality
        if (freshProfile) setUserProfile(freshProfile);
        return;
      }

      try {
        const result = await deductCrystal(currentUser.id, currentStepCost);
        console.log(`[Crystal] Deduction result: ${JSON.stringify(result)}`);

        if (!result.success) {
          alert(`수정구슬 차감 실패: ${result.message || '알 수 없는 오류'}`);
          isProcessingRef.current = false;
          return;
        }

        if (needsQuestionFee) {
          setIsQuestionFeeDeducted(true);
        }
      } catch (err) {
        console.error(err);
        isProcessingRef.current = false;
        return;
      } finally {
        isProcessingRef.current = false;
      }
    }

    // Play sound effect
    triggerFlipSound();

    // Randomly determine reversed status (30% chance)
    const isReversed = Math.random() < 0.3;
    const currentPosition = selectedSpread.slots[selectedCards.length].title;

    const newSelection: SelectedCard = {
      ...card,
      isReversed,
      position: currentPosition
    };

    const newSelected = [...selectedCards, newSelection];
    setSelectedCards(newSelected);

    // Automatically show info for the card just selected
    setActiveTooltipId(card.id);

    if (newSelected.length === selectedSpread.cardCount) {
      // Extended delay to 2.5s so user can see the final card before transition
      setTimeout(() => setStep(AppStep.REVEAL), 2500);
    }
  }, [selectedCards, selectedSpread, question, isQuestionFeeDeducted, currentUser, userProfile]);


  const getReading = useCallback(async () => {
    // Show AdMob Interstitial before reading
    try {
      await showInterstitialAd();
    } catch (e) {
      console.error("Ad show failed", e);
    }

    setStep(AppStep.READING);
    setIsLoading(true);
    try {
      const result = await getTarotReading(question, selectedCards, selectedMbti, selectedSpread.name, userProfile?.nickname);
      setReadingResult(result);

      // Save to history
      const saved = saveReadingToStorage(question, selectedMbti, selectedCards, result, selectedSpread.name);
      setHistory(prev => [saved, ...prev]);
    } catch (error) {
      setReadingResult("죄송합니다. 우주와의 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [question, selectedCards, selectedMbti, selectedSpread.name, userProfile?.nickname]);

  const resetApp = useCallback(() => {
    setStep(AppStep.INTRO);
    setQuestion('');
    // Note: We might want to keep MBTI selected, or reset it. Resetting for now.
    // setSelectedMbti(''); 
    setReadingResult('');
    setSelectedCards([]);
    setDeck([]);
    setIsHistoryMode(false);
    setIsCopied(false);
    setActiveTooltipId(null);
    setIsQuestionFeeDeducted(false);
  }, []);

  const openHistory = useCallback(() => {
    setStep(AppStep.HISTORY);
    setExpandedHistoryId(null); // Reset expansion state when opening history
  }, []);

  const handleResetClick = useCallback(() => {
    resetApp();
  }, [resetApp]);

  const loadHistoryItem = useCallback((item: SavedReading) => {
    setQuestion(item.question);
    setSelectedMbti(item.mbti || '');
    setSelectedCards(item.cards);
    setReadingResult(item.result);
    setIsHistoryMode(true);
    setStep(AppStep.READING);
  }, []);

  const deleteHistoryItem = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteReadingFromStorage(id);
    setHistory(updated);
  }, []);

  const toggleHistoryExpand = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedHistoryId(prev => prev === id ? null : id);
  }, []);

  const generateShareImage = useCallback(async (): Promise<File | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set dimensions (Good for Instagram/Phone sharing)
    canvas.width = 1080;
    canvas.height = 1920;

    const isFiveCards = selectedCards.length === 5;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    // 1. Draw Background
    try {
      const bgImg = await loadImage('/background.jpg');
      const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
      const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
      const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } catch (e) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Headless Layout - Spread Name
    ctx.textAlign = 'center';

    // Draw Spread Name (Gold color) - Moved down for margin
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fde047'; // text-yellow-300
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText(selectedSpread.name, canvas.width / 2, 610);

    // 4. Draw Tarot Cards
    const cardWidth = 280;
    const cardHeight = 500;
    const cardStartY = isFiveCards ? 680 : 720; // 720 allows 300px gap from 420 title

    let maxContentY = 0; // Track where the content ends

    try {
      for (let i = 0; i < selectedCards.length; i++) {
        const card = selectedCards[i];
        let x, y;

        if (isFiveCards) {
          const row = i < 3 ? 0 : 1;
          const col = i < 3 ? i : i - 3;
          const numInRow = row === 0 ? 3 : 2;
          const horizontalGap = 40;
          const rowWidth = numInRow * cardWidth + (numInRow - 1) * horizontalGap;
          x = (canvas.width - rowWidth) / 2 + col * (cardWidth + horizontalGap);
          y = cardStartY + row * 630;
        } else {
          const horizontalGap = 40;
          const totalGap = (selectedCards.length - 1) * horizontalGap;
          const startX = (canvas.width - (selectedCards.length * cardWidth + totalGap)) / 2;
          x = startX + i * (cardWidth + horizontalGap);
          y = cardStartY;
        }

        const img = await loadImage(`/image/${String(card.id).padStart(2, '0')}.jpg`);

        // Card Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;

        // Draw Card with Clip for rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cardWidth, cardHeight, 15);
        ctx.clip();

        if (card.isReversed) {
          ctx.translate(x + cardWidth / 2, y + cardHeight / 2);
          ctx.rotate(Math.PI);
          ctx.drawImage(img, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
          ctx.restore();
        } else {
          ctx.drawImage(img, x, y, cardWidth, cardHeight);
          ctx.restore();
        }
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Card Name & Details
        const nameOffset = 60;
        const dirOffset = 110;
        const meaningOffset = 155;

        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 35px sans-serif';
        ctx.fillText(card.nameKo.split('(')[0].trim(), x + cardWidth / 2, y + cardHeight + nameOffset);

        ctx.fillStyle = card.isReversed ? '#f43f5e' : '#10b981';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(card.isReversed ? '역방향' : '정방향', x + cardWidth / 2, y + cardHeight + dirOffset);

        // Card Meaning (Keywords)
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '30px sans-serif';
        const meaning = card.isReversed ? card.meaningRev : card.meaningUp;
        ctx.fillText(meaning, x + cardWidth / 2, y + cardHeight + meaningOffset);

        const contentBottom = y + cardHeight + meaningOffset;
        if (contentBottom > maxContentY) maxContentY = contentBottom;
      }
    } catch (e) {
      console.error("Card image loading failed", e);
    }

    // 5. Extract Wise Saying (Robust Extraction)
    let extractedQuote = '';
    let extractedAuthor = '';

    const resultLines = readingResult.split('\n');
    for (let i = resultLines.length - 1; i >= 0; i--) {
      const line = resultLines[i].trim();
      if (!line) continue;

      // Extract "Quote" - Author - pattern
      let match = line.match(/^[> \t*]*["“](.*)["”]\s*[-–—:]\s*(.*)[-–—:]?$/);
      if (match) {
        extractedQuote = match[1].replace(/\*\*/g, '').trim();
        extractedAuthor = match[2].replace(/\*\*/g, '').replace(/[-–—:]$/, '').trim();
        break;
      }
    }

    // Draw Footer (Fixed Position)
    const footerY1 = 1800;
    const footerY2 = 1860;

    if (extractedQuote) {
      // Dynamic positioning
      const spaceStart = maxContentY + 20;
      const spaceEnd = footerY1 - 20;
      const availableHeight = spaceEnd - spaceStart;

      let currentY;
      if (availableHeight > 100) {
        currentY = spaceStart + (availableHeight / 2) - 40; // Center in available space
      } else {
        currentY = maxContentY + 80; // Fallback
      }

      // Ensure it doesn't overlap footer
      if (currentY + 100 > footerY1) {
        // If too tight, we might overlap. But usually fine for 3 cards.
      }

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 45px serif';
      const quoteText = `"${extractedQuote}"`;

      const maxWidth = 900;
      const words = quoteText.split(' ');
      let line = '';
      const lineHeight = 65;

      // Draw wrapped text
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, currentY);

      // Draw Author
      ctx.fillStyle = '#94a3b8';
      ctx.font = '40px sans-serif';
      ctx.fillText(`- ${extractedAuthor} -`, canvas.width / 2, currentY + 80);
    }

    ctx.fillStyle = '#ffdd00ff';
    ctx.font = '40px sans-serif';
    ctx.fillText('MBTI 타로운세가 당신의 오늘을 응원합니다.', canvas.width / 2, footerY1);

    ctx.fillStyle = '#64748b';
    ctx.font = '35px sans-serif';
    ctx.fillText('나의 운명 확인하기 : mbtitarot.co.kr', canvas.width / 2, footerY2);

    // Convert to File
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], `mbti-tarot-${Date.now()}.png`, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  }, [selectedCards, selectedSpread, question, readingResult]);

  // --- SHARE HELPERS ---
  const handleShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const shareToKakao = useCallback(async () => {
    // Debug log V6 - Clipboard Strategy
    console.log("Kakao Share Logic V6 Executing...");

    // 1. Copy text to clipboard immediately (User UX enhancement)
    // 1. Copy text to clipboard immediately (User UX enhancement)
    if (readingResult) {
      try {
        // Clean markdown symbols & Add spacing for chapters (Using U+3164 Hangul Filler for FORCE spacing)
        const cleanText = readingResult
          .replace(/(^|\n)#{2,}\s*(.+)/g, '\n\nㅤ\n$2\nㅤ\n') // Cheat code: \n + Filler(ㅤ) + \n
          .replace(/\*\*/g, '')      // Remove bold markers
          .replace(/^\s*\*\s/gm, '') // Remove bullet points at start of lines only
          .replace(/^\s+/gm, '')     // Remove leading spaces
          .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
          .trim();

        const fullText = `[MBTI 타로 운세 결과]\n\n${cleanText}\n\n🔮 https://www.mbtitarot.co.kr/`;
        await navigator.clipboard.writeText(fullText);
      } catch (err) {
        console.warn("Clipboard copy failed:", err);
      }
    }

    // Helper to load SDK dynamically
    const loadKakaoSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.Kakao) {
          resolve(window.Kakao);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
        script.onload = () => resolve(window.Kakao);
        script.onerror = (e) => reject(new Error("Kakao SDK Script Load Failed"));
        document.head.appendChild(script);
      });
    };

    try {
      // 1. Ensure SDK is loaded
      if (!window.Kakao) {
        await loadKakaoSDK();
      }

      // 2. Initialize if needed
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init('0398256e094e7a60932217b241aafdd6');
      }

      // 3. Configure Content
      const imageUrl = selectedCards.length > 0
        ? `https://mbtitarot.co.kr/image/${String(selectedCards[0].id).padStart(2, '0')}.jpg`
        : 'https://mbtitarot.co.kr/intro-landing.jpg';

      // SMART CONTENT STRATEGY:

      // 1. Title Construction: [Card Name + Position] : [Core Meaning]
      // Try to find the core keyword section from readingResult
      let coreKeywords = "결과를 확인해보세요.";

      // New Prompt Format uses Markdown Lists (* **Key**: Value)
      // Extract the whole block under "핵심 키워드"
      const keywordSectionMatch = readingResult?.match(/### 🗝️ 핵심 키워드 🗝️\s*([\s\S]*?)(?=###|$)/);
      if (keywordSectionMatch && keywordSectionMatch[1]) {
        const lines = keywordSectionMatch[1].trim().split('\n');
        // Extract keywords from lines like "* **Key**: Value"
        const extractedWords = lines
          .map(line => line.replace(/^\*\s*/, '').replace(/\*\*/g, '').split(':')[0].trim()) // Get just the key "Key"
          .filter(w => w && !w.startsWith('<') && w.length < 10);

        if (extractedWords.length > 0) {
          coreKeywords = extractedWords.slice(0, 3).join(', ');
        } else {
          // Fallback: just take the raw text if parsing fails
          coreKeywords = keywordSectionMatch[1].replace(/[#*`\-]/g, '').replace(/\n+/g, ', ').trim().slice(0, 50);
        }
      }

      // Card Info
      const card = selectedCards[0];
      const cardName = card ? card.nameKo.split('(')[0].trim() : "운명의 카드";
      const cardDirection = card?.isReversed ? "역방향" : "정방향";

      // Title: [Card Name] (Direction)
      const titleText = `🔑 ${cardName} (${cardDirection})`;

      // Description: Core Keywords + Analysis Summary
      let descText = "";

      // Add Keywords first
      if (coreKeywords && coreKeywords !== "결과를 확인해보세요.") {
        descText += `✨ 키워드: ${coreKeywords}\n\n`;
      }

      // Add Analysis Summary (Dynamic Header Handling)
      // Remove the "Core Keywords" section and "Output Format" overhead first
      const cleanBody = readingResult
        ?.replace(/### 🗝️ 핵심 키워드 🗝️[\s\S]*?(?=###|$)/, '') // Remove top keyword section completely
        .replace(/###\s*[^#\n]+/g, '') // Remove all ### headers
        .replace(/<[^>]+>/g, '') // Remove all HTML tags
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove bullets
        .replace(/\n+/g, ' ') // Collapse newlines
        .trim();

      if (cleanBody) {
        descText += `${cleanBody.slice(0, 150)}...`;
      } else {
        descText += "타로 카드가 전하는 심층적인 메시지를 확인해보세요.";
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: titleText, // Show result text in title area too
          description: descText, // Show rest of result
          imageUrl: imageUrl,
          imageWidth: 800,
          imageHeight: 1200,
          link: {
            mobileWebUrl: 'https://www.mbtitarot.co.kr/',
            webUrl: 'https://www.mbtitarot.co.kr/',
          },
        },
        buttons: [
          {
            title: '상세내용은 붙여넣기 하세요',
            link: {
              mobileWebUrl: 'https://www.mbtitarot.co.kr/',
              webUrl: 'https://www.mbtitarot.co.kr/',
            },
          },
        ],
      });
      setIsShareModalOpen(false);

    } catch (error: any) {
      console.error("Kakao Share Error:", error);
      const errorMsg = error?.message || JSON.stringify(error) || "Unknown Error";
      alert(`⚠️ 카카오톡 공유 실패\n\n[상세 에러]: ${errorMsg}\n\n여전히 안 된다면 도메인 등록이 'http'와 'https' 모두 되어 있는지 확인해주세요.`);
    }
  }, [selectedCards, selectedMbti, question, selectedSpread, readingResult, generateShareImage]);

  const performShare = useCallback(async (type: 'text' | 'image' | 'both') => {
    setIsShareModalOpen(false);
    setIsLoading(true);

    // Clean up result text & Add spacing (Using U+3164 Hangul Filler)
    const cleanReading = readingResult
      .replace(/(^|\n)#{2,}\s*(.+)/g, '\n\nㅤ\n$2\nㅤ\n') // Cheat code: \n + Filler(ㅤ) + \n
      .replace(/\*\*/g, '')
      .replace(/^\s*\*\s/gm, '')
      .replace(/^\s+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Construct text payload with clean visualization
    const textToShare = `🔮 MBTI 타로운세 상세 결과\n` +
      `나의 운명 확인하기: https://www.mbtitarot.co.kr/\n\n` +
      `✨ 질문: "${question || selectedSpread.name}"\n` +
      `👤 성향: ${selectedMbti || '미지'}\n\n` +
      `--------------------------\n` +
      `${cleanReading}\n` +
      `--------------------------\n\n` +
      `#MBTI타로 #운세 #타로카드 #${selectedMbti || '오늘의운세'}`;

    const downloadFile = (file: File) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `mbti-tarot-${Date.now()}.png`;
      link.click();
      alert("이미지가 저장되었습니다!");
    };

    try {
      if (type === 'both') {
        const file = await generateShareImage();
        if (!file) throw new Error('Image generation failed');

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'MBTI 타로운세 결과',
              text: textToShare,
            });
          } catch (shareError: any) {
            if (shareError.name !== 'AbortError') {
              downloadFile(file);
              try { await navigator.clipboard.writeText(textToShare); } catch (e) { }
              alert("이미지가 저장되었으며, 상세 풀이 텍스트가 복사되었습니다.");
            }
          }
        } else {
          downloadFile(file);
          try { await navigator.clipboard.writeText(textToShare); } catch (e) { }
          alert("이미지가 저장되었으며, 상세 풀이 텍스트가 복사되었습니다.");
        }
      } else if (type === 'image') {
        const file = await generateShareImage();
        if (!file) throw new Error('Image generation failed');

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'MBTI 타로운세 결과',
              text: `🔮 MBTI 타로운세 결과입니다.\n나의 운명 확인하기: https://www.mbtitarot.co.kr/`,
            });
          } catch (shareError: any) {
            if (shareError.name !== 'AbortError') downloadFile(file);
          }
        } else {
          downloadFile(file);
        }
      } else {
        // type === 'text'
        if (navigator.share) {
          await navigator.share({
            text: textToShare,
          });
        } else {
          await navigator.clipboard.writeText(textToShare);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          alert("해석 텍스트가 클립보드에 복사되었습니다.");
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Share failed', error);
        alert("공유 처리 중 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [readingResult, question, selectedSpread.name, selectedMbti, generateShareImage]);

  // --- RENDER HELPERS ---

  const renderCardDetailModal = () => {
    if (!viewingCard) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setViewingCard(null)}>
        <div
          className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-700"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-200">{viewingCard.nameKo.split('(')[0].trim()}</h3>
              <p className="text-xs text-slate-400 font-serif">{viewingCard.name}</p>
            </div>
            <button onClick={() => setViewingCard(null)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content (Scrollable) */}
          <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-800">
            {/* Image */}
            <div className="w-full flex justify-center">
              <div className="w-48 h-80 rounded-lg shadow-lg overflow-hidden border border-slate-600 relative bg-slate-900">
                <img
                  src={`/image/${String(viewingCard.id).padStart(2, '0')}.jpg`}
                  alt={viewingCard.name}
                  className="w-full h-full object-fill opacity-100"
                />
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-4">
              <div className="bg-emerald-900/30 p-4 rounded-xl border border-emerald-800">
                <h4 className="text-emerald-400 font-bold mb-1 flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" /> 정방향 (Upright)
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{viewingCard.meaningUp}</p>
              </div>

              <div className="bg-rose-900/30 p-4 rounded-xl border border-rose-800">
                <h4 className="text-rose-400 font-bold mb-1 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> 역방향 (Reversed)
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{viewingCard.meaningRev}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNoticeModal = () => {
    if (!activeNotice) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setActiveNotice(null)}>
        <div
          className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-700"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              {activeNotice === 'tos' ? <FileText className="w-5 h-5 text-indigo-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              <h3 className="text-xl font-bold text-slate-200">
                {activeNotice === 'tos' ? '이용약관' : '개인정보 처리방침'}
              </h3>
            </div>
            <button onClick={() => setActiveNotice(null)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-800">
            {activeNotice === 'tos' ? <TermsOfService /> : <PrivacyPolicy />}
          </div>

          {/* Footer Close Button */}
          <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-end">
            <button
              onClick={() => setActiveNotice(null)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRetryModal = () => {
    if (!isRetryModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setIsRetryModalOpen(false)}>
        <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-6 text-center" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-serif">정말 다시 뽑으시겠습니까?</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed break-keep">
            타로는 <strong>첫 번째 결과</strong>가 당신의 무의식을 가장 정확하게 반영합니다.<br />
            지금 나온 결과의 의미를 한 번 더 깊이 생각해보는 건 어떨까요?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setIsRetryModalOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors text-sm">
              신중하게 생각할게요
            </button>
            <button onClick={() => { setIsRetryModalOpen(false); resetApp(); }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20 text-sm">
              네, 다시 뽑을래요
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderShareModal = () => {
    if (!isShareModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setIsShareModalOpen(false)}>
        <div
          className="relative w-full max-w-xs bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-200 mb-2">공유 방식 선택</h3>
            <p className="text-sm text-slate-400 mb-6">결과를 친구들과 나누어보세요!</p>

            <div className="space-y-3">
              {/* Kakao Share Button - Prominent */}
              <button
                onClick={shareToKakao}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#000000] rounded-2xl transition-all shadow-lg active:scale-95 font-bold mb-2"
              >
                <div className="p-1 bg-[#000000] rounded-full">
                  <MessageSquare className="w-3 h-3 text-[#FEE500] fill-current" />
                </div>
                카카오톡으로 친구에게 자랑하기
              </button>

              <div className="h-px bg-slate-700/50 my-2"></div>

              <button
                onClick={() => performShare('both')}
                className="w-full flex items-center justify-center gap-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50"
              >
                <Sparkles className="w-4 h-4" /> 전체 내용 공유 (이미지+텍스트)
              </button>

              <button
                onClick={() => performShare('image')}
                className="w-full flex items-center justify-center gap-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50"
              >
                <Download className="w-4 h-4" /> 부적 이미지 저장
              </button>

              <button
                onClick={() => performShare('text')}
                className="w-full flex items-center justify-center gap-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50"
              >
                <FileText className="w-4 h-4" /> 텍스트 복사
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsShareModalOpen(false)}
            className="w-full py-3 bg-slate-800/50 text-slate-500 border-t border-slate-800 hover:bg-slate-800 hover:text-slate-300 transition-colors text-sm"
          >
            취소
          </button>
        </div>
      </div>
    );
  };


  const renderUserBadge = () => {
    if (!userProfile) return null;
    return (
      <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/5 shadow-lg">
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <span className="text-sm">🔮</span>
          <span className="text-[13px] font-bold text-indigo-200">{userProfile.crystals}개</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStep(AppStep.MYPAGE)}
            className="flex items-center gap-1 p-0.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 group"
            title="마이페이지"
          >
            <User className="w-3.5 h-3.5 group-hover:text-indigo-400" />
            <span className="text-[13px] font-bold text-slate-300 truncate max-w-[80px]">{userProfile.nickname}님</span>
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-0.5 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-slate-300"
            title="로그아웃"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  const renderSplash = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeIn">
      <img
        src="/intro-landing.jpg"
        alt="MBTI 타로운세"
        className="w-full h-full object-cover"
      />
    </div>
  );


  const renderIntro = () => (
    <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn max-w-6xl px-2 relative w-full pt-1">
      {/* Unified Top Navigation Bar (GNB) */}
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-3 z-30 bg-gradient-to-b from-slate-900/90 to-transparent">
        {/* Left: Brand & Internal Links */}
        <div className="flex items-center gap-4">
          {/* Logo / Home Link */}
          <button
            onClick={() => alert("앱 출시 준비 중입니다!")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-full text-[13px] font-bold shadow-lg hover:bg-white transition-all transform hover:scale-105"
          >
            <Download className="w-4 h-4" /> 앱다운
          </button>

          {/* Desktop Links (Hidden on small screens) */}
          <div className="hidden md:flex gap-4 text-xs font-bold text-slate-400">
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">소개</a>
            <button onClick={() => setStep(AppStep.MBTI_ABOUT)} className="hover:text-white transition-colors">MBTI란?</button>
            <button onClick={() => setStep(AppStep.TAROT_ABOUT)} className="hover:text-white transition-colors">타로란?</button>
            <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">FAQ</a>
            <button onClick={() => setStep(AppStep.COMMUNITY)} className="hover:text-white transition-colors">커뮤니티</button>
          </div>
        </div>

        {/* Right: User Info / Login */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep(AppStep.COMMUNITY)}
            className="md:hidden flex items-center gap-1 text-slate-300 text-xs font-bold"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {userProfile ? (
            renderUserBadge()
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-full text-[13px] font-bold shadow-lg hover:bg-white transition-all transform hover:scale-105"
            >
              <LogIn className="w-4 h-4" /> 로그인
            </button>
          )}
        </div>
      </nav>

      <h1 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-sky-200 to-slate-200 animate-shimmer mt-10 md:mt-14 drop-shadow-lg font-bold">
        MBTI 타로운세
      </h1>

      <div className="h-8 md:h-10 invisible" aria-hidden="true"></div>

      {/* MBTI Selection Section */}
      <div className={`w-full max-w-lg flex flex-col items-center justify-center transition-all ${userProfile ? 'min-h-[70px] mt-12 md:mt-16 mb-0' : 'min-h-[120px] mt-12 md:mt-16'}`}>
        {userProfile ? (
          <div className="flex flex-col items-center animate-fadeIn py-1">
            <label className="block text-white text-sm md:text-base mb-2 font-medium">
              시스템이 분석한 당신의 성향
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-full blur opacity-75 transition duration-1000"></div>
              <div className="relative px-5 py-1 bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-full shadow-lg">
                <span className="text-lg md:text-xl font-black font-serif bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                  {userProfile.mbti}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <label className="block text-white text-sm md:text-base mb-2 font-medium">
              당신의 MBTI를 선택해 주세요.
            </label>

            <div className="mbti-wheel-container">
              <div className="selection-indicator"></div>
              <div
                ref={wheelRef}
                className="mbti-wheel"
              >
                <div className="mbti-wheel-spacer"></div>
                {MBTI_TYPES.map((type) => (
                  <div
                    key={type}
                    data-type={type}
                    onClick={() => {
                      const el = document.querySelector(`[data-type="${type}"]`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    className={`
                        mbti-wheel-item cursor-pointer text-xl font-bold font-serif
                        ${selectedMbti === type ? 'active text-white' : 'text-slate-500 opacity-50'}
                      `}
                  >
                    {type}
                  </div>
                ))}
                <div className="mbti-wheel-spacer"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reading Type Selection */}
      <div className="w-full max-w-lg mt-2 md:mt-4 relative z-20" id="tarot">
        <label className="block text-white text-xs md:text-sm mb-1.5 font-medium opacity-80">
          오늘은 어떤 운세가 궁금한가요?
        </label>
        <div className="grid grid-cols-3 gap-1.5 px-0">
          {Object.values(TAROT_SPREADS).map((spread) => (
            <button
              key={spread.id}
              onClick={() => {
                if (!userProfile && spread.id !== 'TODAY') {
                  setSpreadError('다른 운세는 회원가입 후에 확인이 가능합니다.');
                  setTimeout(() => setSpreadError(null), 3000);
                  setIsAuthModalOpen(true);
                  return;
                }
                setSpreadError(null);
                setSelectedSpread(spread);
              }}
              className={`
                px-1 py-1.5 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center gap-0.5
                ${selectedSpread.id === spread.id
                  ? 'bg-slate-100 text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] transform scale-105'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'}
                ${!userProfile && spread.id !== 'TODAY' ? 'opacity-60 grayscale-[0.5]' : ''}
              `}
            >
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
        {spreadError && (
          <div className="mt-2 text-center animate-bounce">
            <p className="text-[11px] text-rose-400 font-medium flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" /> {spreadError}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-between items-start gap-2 w-full">
        {/* Left Ad */}
        <GoogleAd type="side" />

        <div className="flex flex-col items-center text-center space-y-2 max-w-lg px-2 w-full mx-auto">
          {/* Introductory labels and inputs */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-400 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 flex flex-col items-center shadow-lg transition-all focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400">
              <input
                type="text"
                placeholder="상세한 운세가 궁금하면 직접 입력해주세요"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-slate-200 placeholder-slate-500 text-center text-sm px-3 py-1"
              />
              <p className="text-[10px] text-slate-500 italic mt-1">
                수정구슬 5개가 추가 소모됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-2 w-full px-1">
            <Button
              onClick={startShuffling}
              disabled={!selectedMbti}
              className={`flex items-center justify-center gap-1 group flex-1 py-3 !px-0.5 !font-sans !tracking-normal ${!selectedMbti ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin shrink-0" />
              <span className="text-[13px] font-bold whitespace-nowrap">
                {selectedMbti ? '운명의 카드 섞기' : 'MBTI 선택 필요'}
              </span>
            </Button>
            <Button
              onClick={openHistory}
              variant="secondary"
              className="flex items-center justify-center gap-1 bg-slate-800/80 border-slate-700 text-slate-300 flex-1 py-3 !px-0.5 !font-sans !tracking-normal"
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[13px] font-bold whitespace-nowrap">운명의 기록</span>
            </Button>
          </div>
        </div>

        {/* Right Ad */}
        <GoogleAd type="side" />
      </div>

      {/* Rich Content for AdSense & SEO */}
      <div id="about">
        <React.Suspense fallback={<div className="h-20" />}>
          <LandingContent />
        </React.Suspense>
      </div>

      <div className="pb-4"></div>
    </div>
  );


  const renderHistory = () => (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 animate-fadeIn h-[80vh]">
      <div className="flex items-center justify-between w-full mb-4 bg-slate-900/60 px-2 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-slate-800">
        <button onClick={resetApp} className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 font-bold text-[13px] shrink-0 whitespace-nowrap">
          <ArrowLeft className="w-4 h-4" /> 돌아가기
        </button>
        <h2 className="text-base sm:text-xl font-serif text-slate-200 flex items-center gap-2 font-bold whitespace-nowrap">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /> 운명의 기록
        </h2>
        <div className="w-4"></div> {/* Small spacer for balance */}
      </div>

      {/* Filter & Sort Controls */}
      <div className="w-full mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-slate-900/90 border border-slate-700 rounded-lg flex items-center overflow-hidden focus-within:border-slate-400 transition-colors shadow-sm">
            <Search className="w-4 h-4 text-slate-500 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="질문, MBTI, 카드로 검색..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 py-3 px-3 focus:outline-none text-sm"
            />
            {historySearch && (
              <button onClick={() => setHistorySearch('')} className="mr-2 text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="relative min-w-[140px]">
          <div className="absolute inset-0 bg-slate-700 rounded-lg blur opacity-0 hover:opacity-50 transition"></div>
          <div className="relative bg-slate-900/90 border border-slate-700 rounded-lg flex items-center px-3 py-3 focus-within:border-slate-400 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-500 mr-2" />
            <select
              value={historySort}
              onChange={(e) => setHistorySort(e.target.value as 'newest' | 'oldest')}
              className="bg-transparent border-none text-slate-300 text-sm focus:outline-none w-full appearance-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900 text-slate-200">최신순 (Newest)</option>
              <option value="oldest" className="bg-slate-900 text-slate-200">오래된순 (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-900/30 rounded-2xl backdrop-blur-sm border border-slate-800">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-medium">{historySearch ? "검색 결과가 없습니다." : "저장된 기록이 없습니다."}</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="relative bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-600 transition-all group overflow-hidden mb-4 shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <div
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-800/50"
                onClick={() => loadHistoryItem(item)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400 font-serif tracking-wider font-bold">{item.dateString}</span>
                    {item.readingTypeName && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/30 text-indigo-400 border border-indigo-800/50">
                        {item.readingTypeName}
                      </span>
                    )}
                    {item.mbti && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.mbti}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg text-slate-200 font-medium mb-2">{item.question}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.cards.map((card, i) => (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50 shadow-sm hover:border-slate-600 transition-colors">
                        <div className="w-6 h-10 flex-shrink-0 overflow-hidden rounded-[2px] border border-slate-700">
                          <img
                            src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                            alt={card.name}
                            className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                          />
                        </div>
                        <span className="text-[11px] font-medium leading-none">
                          {card.nameKo.split('(')[0].trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-4">
                  <button
                    onClick={(e) => toggleHistoryExpand(e, item.id)}
                    className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full transition-colors"
                    title={expandedHistoryId === item.id ? "접기" : "카드 상세보기"}
                  >
                    {expandedHistoryId === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Delete Button - Moved to top-right absolute position */}
              <button
                onClick={(e) => deleteHistoryItem(e, item.id)}
                className="absolute top-3 right-3 p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors md:opacity-0 group-hover:opacity-100 z-10"
                title="기록 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Expanded Card Details */}
              {expandedHistoryId === item.id && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-800 animate-fadeIn bg-slate-900/50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {item.cards.map((card, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-sm shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-slate-400 text-xs font-serif uppercase tracking-wider font-bold">
                            {card.position}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${card.isReversed ? 'bg-rose-900/30 text-rose-400 border border-rose-800' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'}`}>
                            {card.isReversed ? '역방향' : '정방향'}
                          </span>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="w-16 h-28 flex-shrink-0 overflow-hidden rounded-md border border-slate-700 shadow-md">
                            <img
                              src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                              alt={card.name}
                              className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 mb-1 text-base leading-tight">{card.nameKo.split('(')[0].trim()}</div>
                            <div className="text-slate-500 text-[10px] italic mb-2">{card.name}</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs border-t border-slate-700 pt-2">
                          <div className={!card.isReversed ? "opacity-100" : "opacity-40"}>
                            <span className="text-emerald-500 block mb-0.5 font-bold">✦ 정방향 (Upright)</span>
                            <span className="text-slate-400 leading-tight block">{card.meaningUp}</span>
                          </div>
                          <div className={card.isReversed ? "opacity-100" : "opacity-40"}>
                            <span className="text-rose-500 block mb-0.5 font-bold">✦ 역방향 (Reversed)</span>
                            <span className="text-slate-400 leading-tight block">{card.meaningRev}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderShuffle = () => {
    // Defines varied animation classes for flying cards
    const shuffleAnims = [
      'animate-fluid-1', 'animate-fluid-2', 'animate-fluid-3',
      'animate-fluid-4', 'animate-fluid-5', 'animate-fluid-6'
    ];

    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh] relative animate-fadeIn">
        {/* Mystical Background Effects - Cool Colors */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border border-slate-700 rounded-full animate-spin-slow bg-slate-800/20 backdrop-blur-sm"></div>
          <div className="absolute w-48 h-48 border border-slate-600 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
        </div>

        {/* Shuffling Cards Container */}
        <div className="relative w-32 h-[228px] sm:w-40 sm:h-[284px] flex items-center justify-center">
          {/* Static Center Stack for weight */}
          <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20">
            <img src={CARD_BACK_IMAGE_URL} className="w-full h-full object-fill opacity-100 rounded-xl" alt="deck" />
          </div>
          {/* Subtle rotation for stack depth */}
          <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-10 rotate-2 translate-x-1 translate-y-1"></div>
          <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-0 -rotate-2 -translate-x-1 -translate-y-1"></div>

          {/* Dynamic Flying Cards */}
          {shuffleAnims.map((anim, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-slate-800 border border-slate-600 rounded-xl shadow-lg ${anim} z-30 opacity-90`}
              style={{ animationDelay: `${i * 0.15}s` }} // Staggered start times
            >
              <img src={CARD_BACK_IMAGE_URL} className="w-full h-full object-fill opacity-100 rounded-xl" alt="flying card" />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-2 relative z-40 bg-slate-900/60 px-6 py-3 rounded-xl backdrop-blur-md shadow-sm border border-slate-800">
          <h2 className="text-2xl font-serif text-slate-300 animate-pulse">운명을 섞는 중...</h2>
          <p className="text-sm text-slate-500 font-medium">카드가 당신의 기운에 반응하고 있습니다.</p>
          <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed opacity-80">
            잠시 눈을 감고 당신이 궁금해하는 질문을<br />마음속으로 깊이 생각해보세요.
          </p>
        </div>

        <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-slate-400 animate-ping opacity-50" />
        <Sparkles className="absolute bottom-1/4 right-1/4 w-4 h-4 text-slate-500 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
      </div>
    );
  };

  const renderSelection = () => (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      <h2 className="text-2xl font-serif text-slate-200 mb-2 font-bold bg-slate-900/60 px-6 py-2 rounded-full backdrop-blur-sm border border-slate-800">
        운명의 카드 선택
      </h2>

      {/* Dynamic Position Indicator */}
      <div className="mb-2 flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-md">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
          <span className="text-sm font-serif text-slate-400 tracking-widest uppercase font-semibold">
            {selectedCards.length < selectedSpread.cardCount
              ? `Pick ${selectedSpread.slots[selectedCards.length]?.title}`
              : 'Selection Complete'}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium italic h-4 bg-slate-900/40 px-2 rounded-md">
          {selectedSpread.slots[selectedCards.length]?.hint || "영험한 기운이 깃든 카드를 고르세요"}
        </span>
      </div>

      {/* Selected Cards Slots (Visual Feedback + Tooltip) */}
      <div className={`grid ${selectedSpread.cardCount === 1 ? 'grid-cols-1' : 'grid-cols-3'} gap-2 sm:gap-4 mb-2 w-full max-w-2xl px-1 justify-items-center`}>
        {selectedSpread.slots.map((slot, idx) => {
          const card = selectedCards[idx];
          const isActive = card && activeTooltipId === card.id;

          return (
            <div key={idx} className="relative group">
              {/* Slot */}
              <div
                className={`
                      relative w-24 h-[170px] sm:w-28 sm:h-[199px] rounded-lg border-2 
                      ${card ? 'border-transparent shadow-[0_4px_15px_rgba(226,232,240,0.3)]' : 'border-dashed border-slate-600 bg-slate-900/40'}
                      flex flex-col items-center justify-start transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden
                   `}
                onClick={(e) => {
                  if (card) {
                    e.stopPropagation();
                    setActiveTooltipId(isActive ? null : card.id);
                  }
                }}
                onMouseEnter={() => card && setActiveTooltipId(card.id)}
                onMouseLeave={() => setActiveTooltipId(null)}
              >
                {card ? (
                  <>
                    <img
                      src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                      alt={card.name}
                      className={`w-full h-full object-cover rounded-lg ${card.isReversed ? 'rotate-180' : ''}`}
                    />
                    {/* Hint Icon Overlay */}
                    {!isActive && (
                      <div className="absolute top-1 right-1 bg-slate-900/60 rounded-full p-0.5 shadow-sm z-20">
                        <Info className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 w-full h-full relative group">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
                      <div className="w-12 h-20 mb-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <img
                          src={CARD_BACK_IMAGE_URL}
                          alt="placeholder"
                          className="w-full h-full object-cover rounded-sm grayscale"
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-serif uppercase tracking-widest font-bold drop-shadow-md">{slot.title}</span>
                    </div>
                    {/* Shadow underneath */}
                    <div className="absolute inset-0 bg-slate-900/40 rounded-lg"></div>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              {card && isActive && (
                <div className="absolute z-50 w-60 sm:w-64 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-xl backdrop-blur-md animate-fadeIn text-left pointer-events-none sm:pointer-events-auto
                                  bottom-full left-1/2 -translate-x-1/2 mb-4
                                  md:bottom-auto md:left-full md:top-0 md:ml-4 md:mb-0 md:translate-x-0">


                  <div className="flex justify-between items-start mb-3 border-b border-slate-700 pb-2">
                    <div>
                      <p className="text-slate-200 font-bold text-sm">{card.nameKo.split('(')[0].trim()}</p>
                      <p className="text-slate-500 text-[10px]">{card.name}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${card.isReversed ? 'border-rose-800 text-rose-400 bg-rose-900/30' : 'border-emerald-800 text-emerald-400 bg-emerald-900/30'}`}>
                      {card.isReversed ? '역방향' : '정방향'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className={!card.isReversed ? 'opacity-100' : 'opacity-40 grayscale'}>
                      <span className="text-emerald-500 font-bold block mb-0.5">정방향 (Upright)</span>
                      <span className="text-slate-400 leading-snug">{card.meaningUp}</span>
                    </div>
                    <div className={card.isReversed ? 'opacity-100' : 'opacity-40 grayscale'}>
                      <span className="text-rose-500 font-bold block mb-0.5">역방향 (Reversed)</span>
                      <span className="text-slate-400 leading-snug">{card.meaningRev}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Deck Display - Carousel */}
      <div className="relative w-full max-w-6xl animate-fadeIn delay-300">
        <CardCarousel
          cards={deck.filter(c => !selectedCards.some(s => s.id === c.id))}
          onSelect={(card) => handleCardSelect(card, 0)}
          onRotate={triggerRotateSound}
        />
      </div>

      {/* Helper Text for Selection */}
      <div className="mt-8 text-center max-w-lg px-6 py-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 backdrop-blur-sm animate-fadeIn delay-500">
        <h3 className="text-slate-400 font-bold mb-2 text-sm">💡 카드 선택 팁</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          카드의 뒷면을 바라보며 마음에 드는 카드를 직관적으로 선택하세요.
          너무 오래 고민하기보다는 처음 눈길이 가는 카드가 종종 가장 정확한 메시지를 담고 있습니다.
          당신의 무의식이 이끄는 대로 카드를 클릭하세요.
        </p>
      </div>
    </div>
  );

  const renderReveal = () => (
    <div className="flex flex-col items-center w-full max-w-6xl animate-fadeIn px-4">


      <div className={`grid ${selectedSpread.cardCount === 1 ? 'grid-cols-1' : 'grid-cols-3'} gap-1 md:gap-2 mb-4 w-full justify-items-center`}>
        {selectedCards.map((card, index) => (
          <div
            key={card.id}
            className={`flex flex-col items-center animate-slideUp group w-full bg-slate-900/40 md:bg-transparent rounded-[1.5rem] md:rounded-none p-1 md:p-0 border border-slate-700/50 md:border-none shadow-md md:shadow-none backdrop-blur-md md:backdrop-blur-none`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <h3 className="text-xs md:text-xl font-serif text-slate-300 font-bold mb-2 md:mb-4 tracking-widest uppercase drop-shadow-sm border-b-2 border-slate-700 pb-1">
              {card.position}
            </h3>

            <div
              className="cursor-pointer group/card transition-all duration-300 hover:scale-105"
              onClick={() => setViewingCard(card)}
            >
              <div className="w-28 h-[200px] sm:w-36 sm:h-64 rounded-xl overflow-hidden shadow-xl border border-slate-500/50 group-hover/card:border-slate-400 transition-all">
                <img
                  src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                  alt={card.name}
                  className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="text-center mt-2 animate-fadeIn">
                <h3 className="text-slate-200 font-serif text-sm font-bold tracking-wider">
                  {card.nameKo.split('(')[0].trim()}
                </h3>
              </div>
            </div>

            <div className="mt-2 flex flex-col items-center transition-all duration-500 w-full">
              <div className="text-center relative bg-slate-900/60 px-2 py-2 rounded-xl backdrop-blur-sm w-full shadow-inner border border-slate-800">
                <div className={`absolute inset-0 blur-2xl opacity-10 ${card.isReversed ? 'bg-rose-600' : 'bg-emerald-600'}`}></div>
                <div className="text-xs text-slate-300 leading-tight font-medium relative z-10 break-keep flex flex-col items-center gap-0.5">
                  <span className={`font-bold ${card.isReversed ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {card.isReversed ? '역방향' : '정방향'}
                  </span>
                  {(card.isReversed ? card.meaningRev : card.meaningUp).split(',').map((meaning, i) => (
                    <span key={i} className="block">{meaning.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={getReading} className="mt-4 flex items-center gap-2 group shadow-lg">
        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
        운명 해석하기
      </Button>
    </div>
  );

  const renderReading = () => (
    <div className="flex flex-col items-center w-full max-w-6xl px-2 md:px-4 animate-fadeIn pb-20">
      {/* Cards Summary Display */}
      {!isLoading && (
        <div className={`grid ${selectedCards.length === 1 ? 'grid-cols-1' : selectedCards.length === 5 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3'} gap-2 md:gap-4 mb-2 w-full max-w-4xl justify-items-center`}>
          {selectedCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="flex flex-col items-center group cursor-pointer animate-slideUp"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => setViewingCard(card)}
            >
              <div className="text-[10px] md:text-xs font-serif text-slate-400 font-bold mb-1.5 tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                {card.position}
              </div>
              <div className="w-20 h-36 md:w-28 md:h-[200px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-lg overflow-hidden border border-slate-700/50 group-hover:border-slate-500 bg-slate-900">
                <img
                  src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                  alt={card.name}
                  className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11px] md:text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{card.nameKo.split('(')[0].trim()}</div>
                <div className={`text-[10px] font-medium ${card.isReversed ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {card.isReversed ? '역방향' : '정방향'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Moon Phase & MBTI Indicator - Only show when reading is ready */}
      {!isLoading && (
        <div className="w-full flex justify-center mb-2 animate-fadeIn delay-300 md:gap-4 gap-2 flex-row flex-nowrap items-stretch">
          {/* Moon Phase */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 shadow-sm text-slate-300 text-[11px] sm:text-sm backdrop-blur-sm hover:bg-slate-800 transition-colors flex-1 justify-center min-w-0">
            <span className="text-base sm:text-xl shrink-0">{moonData.icon}</span>
            <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden">
              <span className="text-lg md:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 animate-shimmer whitespace-nowrap truncate">{moonData.phaseKo}</span>
              <span className="hidden sm:inline border-l border-slate-600 mx-2 h-3"></span>
              <span className="opacity-70 italic font-light truncate hidden sm:block">{moonData.influence}</span>
            </div>
          </div>

          {/* MBTI Indicator */}
          {selectedMbti && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 shadow-sm text-slate-300 text-[11px] sm:text-sm backdrop-blur-sm hover:bg-slate-800 transition-colors flex-1 justify-center min-w-0">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <span className="text-lg md:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 animate-shimmer tracking-widest whitespace-nowrap">{selectedMbti}</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] animate-fadeIn w-full max-w-lg mx-auto">
            {/* Mystical Portal Loader */}
            <div className="relative flex items-center justify-center">

              {/* Rotating Light Ring */}
              <div className="absolute w-64 h-64 rounded-full border border-slate-500/30 animate-spin-slow"></div>
              <div className="absolute w-56 h-56 rounded-full border border-slate-400/20 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>

              {/* Pulsing Light Aura */}
              <div className="absolute inset-0 bg-slate-400/5 blur-[60px] rounded-full animate-pulse"></div>

              {/* Central Card Stack Effect */}
              <div className="relative w-32 h-48 sm:w-40 sm:h-60">
                {/* Back Card (Echo) */}
                <div className="absolute inset-0 bg-slate-800/20 rounded-xl border border-slate-600/40 transform translate-x-4 translate-y-2 rotate-6 opacity-40 animate-pulse"></div>
                {/* Middle Card (Echo) */}
                <div className="absolute inset-0 bg-slate-700/30 rounded-xl border border-slate-500/50 transform -translate-x-4 translate-y-1 -rotate-3 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                {/* Front Main Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl border border-slate-500 shadow-[0_0_25px_rgba(226,232,240,0.15)] overflow-hidden flex items-center justify-center z-10">
                  {/* Shimmer Effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

                  {/* Icon */}
                  <div className="relative z-10 flex flex-col items-center gap-2 opacity-80">
                    <Sparkles className="w-8 h-8 text-slate-300 animate-spin-slow" />
                    <div className="w-12 h-1 bg-slate-500/50 rounded-full mt-2"></div>
                    <div className="w-8 h-1 bg-slate-500/50 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              <Stars className="absolute -top-8 -right-8 w-6 h-6 text-slate-400 animate-bounce opacity-60" style={{ animationDuration: '3s' }} />
              <Moon className="absolute -bottom-4 -left-12 w-5 h-5 text-slate-500 animate-pulse opacity-60" />
            </div>

            {/* Text Feedback */}
            <div className="mt-16 text-center space-y-3 relative z-10 bg-slate-900/40 px-8 py-6 rounded-2xl backdrop-blur-sm border border-slate-700/60 shadow-sm">
              <h3 className="text-xl md:text-2xl font-serif text-slate-300 font-bold tracking-wide flex items-center justify-center gap-3">
                <span className="animate-pulse">✨</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                  운명을 읽어내는 중
                </span>
                <span className="animate-pulse">✨</span>
              </h3>
              <p className="text-sm text-slate-500 font-medium italic">
                {selectedMbti ? `${selectedMbti}의 내면과 우주의 흐름을 연결하고 있습니다...` : '카드의 상징과 별들의 배치를 해석하고 있습니다...'}
              </p>
            </div>
          </div>
        ) : (
          <div ref={readingRef} className="w-full">
            {/* Enhanced Question Header */}
            <div className="flex flex-col items-center mb-2 border-b border-slate-700/50 pb-2 text-center relative bg-gradient-to-b from-slate-900/60 to-slate-800/40 p-4 rounded-xl backdrop-blur-md shadow-sm ring-1 ring-slate-700/50">
              {isHistoryMode && (
                <span className="absolute top-0 right-0 sm:static sm:mb-2 text-xs text-slate-400 border border-slate-600 rounded-full px-3 py-1 bg-slate-800 shadow-sm">
                  📜 기록 열람 중
                </span>
              )}

              <div className="flex items-center justify-center gap-3 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                <span className="text-lg md:text-xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-100 animate-shimmer tracking-widest uppercase drop-shadow-md">{selectedSpread.name}</span>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              </div>

              {question && (
                <h3 className="text-xl md:text-2xl font-sans font-bold text-slate-200 py-1 leading-tight drop-shadow-sm">
                  "{question}"
                </h3>
              )}
            </div>

            {/* Book Page Container - Minimal Margins as requested */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col relative transition-all duration-500">

                {/* Header / Title of Chapter */}
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/50 text-center relative">
                  <h3 className="text-lg md:text-xl font-serif font-bold text-slate-100 drop-shadow-md">
                    {readingSections[currentPage]?.title || "결과 분석"}
                  </h3>
                  {/* Progress Indicator (Dots) */}
                  <div className="flex justify-center gap-1.5 mt-2">
                    {readingSections.map((_, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-slate-200 w-3' : 'bg-slate-600'}`} />
                    ))}
                  </div>
                </div>

                {/* Content Area - Scrollable with reduced padding */}
                <div className="flex-1 p-3 md:p-5 overflow-y-auto custom-scrollbar bg-slate-900/40">
                  <div className="animate-fadeIn">


                    <ReactMarkdown
                      components={{
                        // Minimized margins for book format
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl md:text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-300 mb-3 mt-1 font-bold border-b border-slate-700/50 pb-2 drop-shadow-sm" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg md:text-xl font-serif text-slate-100 mb-3 mt-5 font-bold flex items-center gap-2 border-l-4 border-slate-600 pl-3 py-1 bg-slate-800/20 rounded-r-md drop-shadow-sm" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-base md:text-lg font-serif text-slate-200 mb-2 mt-4 font-bold opacity-90" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base font-normal tracking-wide break-keep" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="text-amber-200 font-bold drop-shadow-[0_0_1px_rgba(255,191,0,0.3)]" {...props} />
                        ),
                        li: ({ node, children, ...props }) => {
                          const text = String(children);
                          if (text.includes('chapter_link:')) {
                            const [_, index, title] = text.split(':');
                            return (
                              <button
                                onClick={() => setCurrentPage(parseInt(index))}
                                className="w-full bg-slate-800/60 hover:bg-slate-700/80 rounded-xl p-4 border border-slate-700/50 mb-1 transition-all duration-300 group flex items-center justify-center relative"
                              >
                                <div className="text-center">
                                  {/* Number badge removed */}
                                  <span className="text-slate-200 font-medium group-hover:text-white px-2">{title}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-1 transition-all absolute right-4" />
                              </button>
                            );
                          }
                          return <li className="bg-slate-800/40 rounded-lg p-2 border border-slate-700/50 mb-2 list-none text-sm text-slate-300" {...props}>{children}</li>
                        },
                        ul: ({ node, ...props }) => (
                          <ul className="space-y-1 my-2 pl-0" {...props} />
                        ),
                        hr: ({ node, ...props }) => (
                          <hr className="border-t border-slate-700 my-4" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-2 border-slate-500 pl-3 italic text-slate-400 my-3 text-sm" {...props} />
                        ),
                      }}
                    >
                      {readingSections[currentPage]?.content || "내용을 불러오는 중입니다..."}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    variant="secondary"
                    className="!px-3 !py-1.5 !text-xs flex items-center gap-1 min-w-[80px] justify-center"
                  >
                    <ChevronLeft className="w-3 h-3" /> 이전
                  </Button>

                  <span className="text-[10px] text-slate-500 font-serif uppercase tracking-widest">
                    Chapter {currentPage + 1}
                  </span>

                  <Button
                    onClick={() => setCurrentPage(p => Math.min(readingSections.length - 1, p + 1))}
                    disabled={currentPage === readingSections.length - 1}
                    variant="secondary"
                    className={`!px-3 !py-1.5 !text-xs flex items-center gap-1 min-w-[80px] justify-center ${currentPage === readingSections.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    다음 <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>



      <div className="flex flex-row justify-center items-start gap-4 w-full relative">
        {/* Left Ad */}
        <GoogleAd type="side" />

        <div className="w-full max-w-4xl flex flex-col items-center">
          {!isLoading && (
            <div className="mt-8 w-full max-w-md mx-auto px-2 space-y-3">
              {/* Primary Actions (Share & Save) */}
              {/* Primary Actions (Share & Save) */}
              <div className="flex gap-1 w-full">
                {/* 1. Kakao Share */}
                <Button
                  onClick={shareToKakao}
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-[#FEE500] hover:bg-[#FDD835] text-slate-900 border-none shadow-lg active:scale-95 transition-all text-sm font-bold !px-0 !rounded-md"
                >
                  💬 카톡공유
                </Button>

                {/* 2. Copy Full Text */}
                <Button
                  onClick={() => performShare('text')}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 shadow-lg active:scale-95 transition-all text-sm font-bold !px-0 !rounded-md"
                >
                  📜 전체운세
                </Button>

                {/* 3. Save Image */}
                <Button
                  onClick={() => performShare('image')}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 shadow-lg active:scale-95 transition-all text-sm font-bold !px-0 !rounded-md"
                >
                  📥 부적저장
                </Button>
              </div>

              {/* Secondary Actions (Home & Retry) */}
              {/* Secondary Actions (Home & Retry) */}
              <div className="flex gap-2 w-full">
                {isHistoryMode ? (
                  <Button onClick={openHistory} className="flex-1 flex items-center justify-center gap-2 group shadow-lg">
                    <ArrowLeft className="w-4 h-4" />
                    목록으로 돌아가기
                  </Button>
                ) : (
                  <Button onClick={handleResetClick} className="flex-1 flex items-center justify-center gap-2 group shadow-lg">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    다른 운세 보기
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Ad */}
        <GoogleAd type="side" />
      </div>
    </div >
  );

  // Show splash screen first
  if (showSplash) {
    return renderSplash();
  }

  const renderMyPage = () => {
    if (!userProfile) {
      setStep(AppStep.INTRO);
      return null;
    }
    return (
      <MyPage
        userProfile={userProfile}
        onBack={() => setStep(AppStep.INTRO)}
      />
    );
  };

  const renderCommunity = () => (
    <div className="w-full max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6 px-4 pt-12">
        <button
          onClick={() => setStep(AppStep.INTRO)}
          className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">커뮤니티</h2>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-3 py-1.5 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60 transition-colors border border-red-800/50">
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-bold">로그아웃</span>
        </button>
      </div>

      <BoardList
        key={boardRefreshKey}
        onPostClick={(post) => setSelectedPost(post)}
        onWriteClick={() => {
          if (!currentUser) setIsAuthModalOpen(true);
          else {
            setEditingPost(null);
            setIsPostEditorOpen(true);
          }
        }}
      />
    </div>
  );

  const renderMbtiAbout = () => (
    <div className="w-full max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6 px-4 pt-12">
        <button
          onClick={() => setStep(AppStep.INTRO)}
          className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">MBTI 가이드</h2>
      </div>
      <MbtiAbout />
    </div>
  );

  const renderTarotAbout = () => (
    <div className="w-full max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6 px-4 pt-12">
        <button
          onClick={() => setStep(AppStep.INTRO)}
          className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white">타로 가이드</h2>
      </div>
      <TarotAbout />
    </div>
  );

  return (
    <div className="min-h-screen text-slate-200 overflow-x-hidden font-sans selection:bg-slate-600 selection:text-white relative">
      {/* Background Image Layer - Updated for Cool Theme */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-top bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('${APP_BACKGROUND_IMAGE_URL}')`,
          filter: 'contrast(1.1) brightness(0.9)'
        }}
      ></div>

      {/* Overlay Layer for Readability - Reduced tint for brightness */}
      <div className="fixed inset-0 z-0 bg-slate-950/45"></div>

      {/* Animated Orbs Layer - Cool Blue/Cyan Tones */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 mix-blend-screen opacity-30">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]"
          style={{ opacity: 0.3 + (moonData.intensity * 0.1) }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500/20 rounded-full blur-[120px]"
          style={{ opacity: 0.3 + (moonData.intensity * 0.1) }}
        ></div>
        <div
          className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]"
          style={{ opacity: 0.2 + (moonData.intensity * 0.2) }}
        ></div>
      </div>

      {/* Global Header for non-Intro pages */}
      {
        step !== AppStep.INTRO && (
          <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center pointer-events-none">
            {/* Left: Home Button */}
            <div className="pointer-events-auto">
              <button
                onClick={() => {
                  const message = step === AppStep.READING
                    ? "초기 화면으로 돌아가시겠습니까?"
                    : "초기 화면으로 돌아가시겠습니까? 진행 중인 내용은 저장되지 않습니다.";

                  if (confirm(message)) {
                    setStep(AppStep.INTRO);
                    setReadingResult(null);
                    setSelectedCards([]);
                    setIsHistoryMode(false);
                  }
                }}
                className="p-2 bg-slate-900/40 backdrop-blur-md rounded-full text-slate-200 hover:bg-slate-800 hover:text-white transition-all border border-white/10 shadow-lg"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Crystal & Menu */}
            <div className="pointer-events-auto flex items-center gap-3">
              {currentUser && userProfile && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/40 backdrop-blur-md rounded-full border border-indigo-500/30 shadow-lg animate-fadeIn">
                  <span className="text-sm shadow-sm">🔮</span>
                  <span className="text-sm font-bold text-indigo-200 shadow-sm">{userProfile.crystals}개</span>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 bg-slate-900/40 backdrop-blur-md rounded-full text-slate-200 hover:bg-slate-800 hover:text-white transition-all border border-white/10 shadow-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </header>
        )
      }

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-2">
        {step === AppStep.INTRO && renderIntro()}
        {step === AppStep.HISTORY && renderHistory()}
        {step === AppStep.COMMUNITY && renderCommunity()}
        {step === AppStep.MBTI_ABOUT && renderMbtiAbout()}
        {step === AppStep.TAROT_ABOUT && renderTarotAbout()}
        {step === AppStep.MYPAGE && renderMyPage()}
        {step === AppStep.SHUFFLE && renderShuffle()}
        {step === AppStep.SELECTION && renderSelection()}
        {step === AppStep.REVEAL && renderReveal()}
        {step === AppStep.READING && renderReading()}
      </main>

      {/* Card Detail Modal */}
      {viewingCard && renderCardDetailModal()}

      {/* Notice Modal */}
      {activeNotice && renderNoticeModal()}





      <React.Suspense fallback={<div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center"><Sparkles className="w-8 h-8 text-slate-400 animate-spin" /></div>}>
        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onShowNotice={(type) => setActiveNotice(type)}
        />

        {/* Community Modals */}
        {userProfile && (
          <PostEditor
            isOpen={isPostEditorOpen}
            onClose={() => {
              setIsPostEditorOpen(false);
              setEditingPost(null);
            }}
            userProfile={userProfile}
            editingPost={editingPost}
            onSuccess={() => {
              setBoardRefreshKey(prev => prev + 1);
            }}
          />
        )}

        {selectedPost && (
          <PostDetail
            post={selectedPost}
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            onEdit={(post) => {
              setEditingPost(post);
              setIsPostEditorOpen(true);
              setSelectedPost(null);
            }}
            onDeleteSuccess={() => {
              setBoardRefreshKey(prev => prev + 1);
            }}
            currentUser={currentUser}
            userProfile={userProfile}
          />
        )}
      </React.Suspense>

      {/* Global Copyright Footer - Grouped links and copyright with minimal spacing */}
      <footer className="w-full py-4 text-center z-20 mt-auto flex flex-col items-center gap-1.5">
        {/* MBTI Keyword Links for SEO */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4 text-[9px] text-slate-500 mb-2">
          {MBTI_TYPES.map(type => (
            <a key={type} href="#mbti" className="hover:text-indigo-400 transition-colors">
              {type} 운세
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-4 text-white text-[10px] md:text-xs opacity-60">
          <a
            href="/terms"
            onClick={(e) => { e.preventDefault(); setActiveNotice('tos'); }}
            className="hover:opacity-100 transition-opacity cursor-pointer"
          >
            이용약관
          </a>
          <span className="opacity-30">|</span>
          <a
            href="/privacy"
            onClick={(e) => { e.preventDefault(); setActiveNotice('privacy'); }}
            className="hover:opacity-100 transition-opacity cursor-pointer"
          >
            개인정보 처리방침
          </a>
        </div>
        <p className="text-white text-[9px] md:text-[11px] opacity-40">
          MBTI 타로운세 2025 / Powered by ⓒHongLabAI
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div >
  );
};

export default App;