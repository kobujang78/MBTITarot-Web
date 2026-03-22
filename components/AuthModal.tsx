import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { checkNicknameExists, registerUser, getUserProfile } from '../services/userService';
import { X, Mail, Lock, User, UserPlus, LogIn, AlertCircle, Github } from 'lucide-react';
import Button from './Button';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShowNotice?: (type: 'tos' | 'privacy' | 'marketing') => void;
}

const AuthModal: React.FC<AuthModalProps> = React.memo(({ isOpen, onClose, onShowNotice }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [mbti, setMbti] = useState('INFP');
    const [referrer, setReferrer] = useState('');
    const [agreedTos, setAgreedTos] = useState(false);
    const [agreedPrivacy, setAgreedPrivacy] = useState(false);
    const [agreedMarketing, setAgreedMarketing] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [socialUser, setSocialUser] = useState<any>(null); // For completing social profile
    const [showMbtiTest, setShowMbtiTest] = useState(false);

    // Reset to login mode whenever the modal is opened
    React.useEffect(() => {
        if (isOpen) {
            setIsLogin(true);
            setError('');
            setConfirmPassword('');
            setAgreedTos(false);
            setAgreedPrivacy(false);
            setAgreedMarketing(false);
            setSocialUser(null);
        }
    }, [isOpen]);

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'CLOSE_MBTI_TEST') {
                setShowMbtiTest(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Check sequence for Supabase OAuth login completion
    React.useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await getUserProfile(session.user.id);
                if (!profile && isOpen) {
                    setSocialUser(session.user);
                    setIsLogin(false);
                    setError('정상적인 서비스 이용을 위해 추가 정보를 입력해주세요.');
                } else if (profile && isOpen) {
                    onClose();
                }
            }
        };
        if (isOpen) checkAuth();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (socialUser) {
                // Complete Social Profile
                if (!nickname) throw new Error('닉네임을 입력해주세요.');
                if (!agreedTos || !agreedPrivacy) throw new Error('이용약관 및 개인정보 처리방침에 동의해주세요.');

                const exists = await checkNicknameExists(nickname);
                if (exists) throw new Error('이미 사용 중인 닉네임입니다.');

                await registerUser(socialUser.id, socialUser.email || '', nickname, mbti, referrer, agreedMarketing);
                onClose();
            } else if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                onClose();
            } else {
                // Sign Up Logic
                if (!nickname) throw new Error('닉네임을 입력해주세요.');
                if (password !== confirmPassword) throw new Error('비밀번호가 일치하지 않습니다.');
                if (!agreedTos || !agreedPrivacy) throw new Error('이용약관 및 개인정보 처리방침에 동의해주세요.');

                const exists = await checkNicknameExists(nickname);
                if (exists) throw new Error('이미 사용 중인 닉네임입니다.');

                const isCapacitor = window.Capacitor?.isNative;
                const redirectUrl = isCapacitor
                    ? 'com.honglabai.mbtitarot.app://login-callback'
                    : window.location.origin;

                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: redirectUrl,
                        data: {
                            nickname,
                            mbti,
                            referrer,
                            marketingConsent: agreedMarketing
                        }
                    }
                });

                if (signUpError) throw signUpError;
                if (!data.user) throw new Error('회원가입 중 오류가 발생했습니다.');

                // If email confirmation is enabled, session will be null.
                if (data.user && !data.session) {
                    alert('인증 메일이 발송되었습니다. 이메일을 확인하여 가입을 완료해주세요.');
                    onClose();
                    return;
                }

                // Session exists (auto-confirm or social login)
                // We do NOT call registerUser here anymore because App.tsx handles it
                // via onAuthStateChange -> auto-registration using metadata.
                // This prevents race conditions and RLS errors.
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || '오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'apple' | 'github') => {
        setError('');
        setIsLoading(true);
        try {
            const isCapacitor = window.Capacitor?.isNative;
            const redirectUrl = isCapacitor
                ? `com.honglabai.mbtitarot.app://${provider}-auth`
                : window.location.origin;

            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: redirectUrl
                }
            });
            if (oauthError) throw oauthError;
        } catch (err: any) {
            console.error(err);
            setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} 로그인 중 오류가 발생했습니다.`);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
                <div
                    className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 text-center border-b border-white/5 bg-gradient-to-b from-slate-800 to-slate-900">
                        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="inline-flex p-1.5 rounded-xl bg-slate-800 mb-2 border border-white/5">
                            {isLogin ? <LogIn className="w-4 h-4 text-indigo-400" /> : <UserPlus className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <h2 className="text-lg font-bold text-white leading-tight uppercase tracking-wide">
                            로그인
                        </h2>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">SNS 계정으로 간편하게 시작하세요</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                            {isLogin ? '로그인이 필요합니다' : '회원가입하고 혜택을 받으세요'}
                        </p>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Tabs Integration */}
                        {!socialUser && (
                            <div className="flex p-1 bg-slate-800/80 rounded-xl mb-2 border border-white/5 shadow-inner">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${isLogin ? 'bg-indigo-600 text-white shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    로그인
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${!isLogin ? 'bg-indigo-600 text-white shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    회원가입
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center gap-3 text-red-200 text-xs animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {!socialUser && (
                            <div className="space-y-2">
                                {/* Google */}
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin('google')}
                                    className="w-full flex items-center bg-white border border-[#dadce0] rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden h-[42px]"
                                >
                                    <div className="px-4 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 18 18">
                                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.331C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                            <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.963H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.037l3.007-2.331z" fill="#FBBC05" />
                                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.963L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335" />
                                        </svg>
                                    </div>
                                    <span className="flex-1 text-[#3c4043] font-medium text-[13px] text-center pr-10">Google 로그인</span>
                                </button>

                                {/* Kakao */}
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin('kakao')}
                                    className="w-full flex items-center bg-[#FEE500] rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden h-[42px]"
                                >
                                    <div className="px-4 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 18 18">
                                            <path fill="#3A1D1D" d="M9 4C5.134 4 2 6.164 2 8.832c0 1.734 1.312 3.25 3.32 4.103-.134.464-.485 1.678-.555 1.94-.088.33.111.326.234.246.096-.063 1.545-1.048 2.162-1.464.274.039.553.059.839.059 3.866 0 7-2.164 7-4.832C16 6.164 12.866 4 9 4z" />
                                        </svg>
                                    </div>
                                    <span className="flex-1 text-[#3A1D1D] font-medium text-[13px] text-center pr-10">Kakao 로그인</span>
                                </button>

                                {/* Apple */}
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin('apple')}
                                    className="w-full flex items-center bg-black border border-slate-700 rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden h-[42px]"
                                >
                                    <div className="px-4 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                                            <path d="M12.984 9.69c-.012-1.92 1.572-2.844 1.644-2.892-.888-1.308-2.28-1.488-2.772-1.512-1.176-.12-2.304.696-2.904.696-.6 0-1.524-.684-2.508-.684-1.284.012-2.472.744-3.132 1.896-1.344 2.328-.348 5.76.96 7.644.636.924 1.404 1.956 2.4 1.92 1.056-.048 1.452-.684 2.724-.684 1.26 0 1.62.684 2.736.66 1.14-.024 1.8-.936 2.496-1.944.804-1.176 1.128-2.316 1.152-2.376-.024-.012-2.22-.852-2.244-3.372zM11.196 3.96c.528-.648.888-1.536.792-2.424-.756.036-1.68.516-2.22 1.14-.48.552-.9 1.452-.78 2.328.852.06 1.704-.42 2.208-1.044z" />
                                        </svg>
                                    </div>
                                    <span className="flex-1 text-white font-medium text-[13px] text-center pr-10">Apple 로그인</span>
                                </button>

                                {/* GitHub */}
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin('github')}
                                    className="w-full flex items-center bg-[#24292e] border border-slate-600 rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden h-[42px]"
                                >
                                    <div className="px-4 flex items-center justify-center">
                                        <Github className="w-[18px] h-[18px] text-white" />
                                    </div>
                                    <span className="flex-1 text-white font-medium text-[13px] text-center pr-10">GitHub 로그인</span>
                                </button>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/5"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase">
                                        <span className="bg-slate-900 px-3 text-slate-500 font-bold tracking-widest">또는 이메일</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                    <input
                                        type="email"
                                        placeholder="이메일 주소"
                                        required
                                        disabled={!!socialUser}
                                        value={socialUser ? socialUser.email : email}
                                        onChange={e => setEmail(e.target.value)}
                                        className={`w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-10 text-white focus:outline-none focus:border-indigo-500 transition-colors text-[12px] ${socialUser ? 'opacity-50' : ''}`}
                                    />
                                </div>

                                {!socialUser && (
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                        <input
                                            type="password"
                                            placeholder="비밀번호"
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-10 text-white focus:outline-none focus:border-indigo-500 transition-colors text-[12px]"
                                        />
                                    </div>
                                )}

                                {!socialUser && !isLogin && (
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                        <input
                                            type="password"
                                            placeholder="비밀번호 확인"
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-10 text-white focus:outline-none focus:border-indigo-500 transition-colors text-[12px]"
                                        />
                                    </div>
                                )}
                            </div>

                            {!isLogin && (
                                <div className="space-y-3 pt-1 animate-fadeIn">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="사용할 닉네임"
                                            required
                                            maxLength={10}
                                            value={nickname}
                                            onChange={e => setNickname(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-10 text-white focus:outline-none focus:border-emerald-500 transition-colors text-[12px]"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-bold text-slate-500 tracking-tighter">MBTI 선택</label>
                                            <button type="button" onClick={() => setShowMbtiTest(true)} className="text-[10px] text-indigo-400 hover:underline">테스트하기</button>
                                        </div>
                                        <select
                                            value={mbti}
                                            onChange={e => setMbti(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-1.5 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer text-[12px]"
                                        >
                                            {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="추천인 (선택)"
                                            value={referrer}
                                            onChange={e => setReferrer(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-10 text-white focus:outline-none focus:border-emerald-500 transition-colors text-[12px]"
                                        />
                                    </div>

                                    <div className="space-y-1 pt-1">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="tos" checked={agreedTos} onChange={e => setAgreedTos(e.target.checked)} className="w-3 h-3 rounded border-slate-700 bg-slate-800 text-emerald-500" />
                                            <label htmlFor="tos" className="text-[10px] text-slate-500"><button type="button" onClick={() => onShowNotice?.('tos')} className="text-slate-400 hover:underline">이용약관</button> 동의 (필수)</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="privacy" checked={agreedPrivacy} onChange={e => setAgreedPrivacy(e.target.checked)} className="w-3 h-3 rounded border-slate-700 bg-slate-800 text-emerald-500" />
                                            <label htmlFor="privacy" className="text-[10px] text-slate-500"><button type="button" onClick={() => onShowNotice?.('privacy')} className="text-slate-400 hover:underline">개인정보 처리방침</button> 동의 (필수)</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="marketing" checked={agreedMarketing} onChange={e => setAgreedMarketing(e.target.checked)} className="w-3 h-3 rounded border-slate-700 bg-slate-800 text-amber-500" />
                                            <label htmlFor="marketing" className="text-[10px] text-slate-500"><button type="button" onClick={() => onShowNotice?.('marketing')} className="text-slate-400 hover:underline">마케팅 정보 수신</button> 동의 (선택)</label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-2.5 mt-2 font-bold text-[13px]"
                                disabled={isLoading}
                            >
                                {isLoading ? '처리 중...' : (socialUser ? '가입 완료하기' : (isLogin ? '로그인' : '회원 가입'))}
                            </Button>
                        </form>

                        <div className="text-center pt-2 border-t border-white/5">
                            <p className="text-slate-500 text-[9px] mb-1 italic">
                                MBTI Tarot - 우주의 흐름을 읽다
                            </p>
                            {socialUser && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        onClose();
                                    }}
                                    className="text-[11px] font-bold text-slate-500 hover:text-slate-300 underline mt-2"
                                >
                                    다른 계정 사용 (로그아웃)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MBTI Test Modal */}
            {
                showMbtiTest && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-0 md:p-4">
                        <div className="relative w-full h-full md:h-[90vh] md:w-[90vw] md:max-w-4xl bg-white md:rounded-2xl overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-3 bg-slate-900 text-white border-b border-white/10 shrink-0">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="text-xl">🔮</span> MBTI 간편 테스트
                                </h3>
                                <button
                                    onClick={() => setShowMbtiTest(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <iframe
                                src="/mbtitest/mbtitest.html"
                                className="w-full flex-1 border-0"
                                title="MBTI Test"
                            />
                        </div>
                    </div>
                )
            }
        </>
    );
});

export default AuthModal;
