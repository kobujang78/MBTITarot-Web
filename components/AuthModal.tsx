import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { checkNicknameExists, registerUser, getUserProfile } from '../services/userService';
import { X, Mail, Lock, User, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import Button from './Button';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShowNotice?: (type: 'tos' | 'privacy') => void;
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

                await registerUser(socialUser.id, socialUser.email || '', nickname, mbti, referrer);
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
                            referrer
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

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            const isCapacitor = window.Capacitor?.isNative;
            const redirectUrl = isCapacitor
                ? 'com.honglabai.mbtitarot.app://google-auth'
                : window.location.origin;

            const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: isCapacitor // For native, we handle the open ourselves if needed, but Supabase SDK usually handles it. 
                    // Actually, for Capacitor context with Supabase, standard practice is letting the browser open.
                }
            });
            if (oauthError) throw oauthError;
            // The logic continues in the useEffect after redirect (App.tsx handles the callback)
        } catch (err: any) {
            console.error(err);
            setError('Google 로그인 중 오류가 발생했습니다.');
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
                        <h2 className="text-lg font-bold text-white leading-tight">
                            {isLogin ? '반가워요!' : '환영합니다!'}
                        </h2>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                            {isLogin ? '로그인이 필요합니다' : '회원가입하고 혜택을 받으세요'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-3">
                        {error && (
                            <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="이메일 주소"
                                    required
                                    disabled={!!socialUser}
                                    value={socialUser ? socialUser.email : email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={`w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-11 text-white focus:outline-none focus:border-indigo-500 transition-colors text-[13px] ${socialUser ? 'opacity-50' : ''}`}
                                />
                            </div>

                            {/* Password */}
                            {!socialUser && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-11 text-white focus:outline-none focus:border-indigo-500 transition-colors text-[13px]"
                                    />
                                </div>
                            )}

                            {!socialUser && !isLogin && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="비밀번호 확인"
                                        required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-11 text-white focus:outline-none focus:border-indigo-500 transition-colors text-[13px]"
                                    />
                                </div>
                            )}

                            {!isLogin && (
                                <>
                                    {/* Nickname */}
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="사용할 닉네임"
                                            required
                                            maxLength={10}
                                            value={nickname}
                                            onChange={e => setNickname(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-11 text-white focus:outline-none focus:border-emerald-500 transition-colors text-[13px]"
                                        />
                                    </div>

                                    {/* MBTI Selection */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 ml-1.5 flex items-center gap-1.5">
                                            당신의 MBTI를 선택해주세요
                                        </label>
                                        <select
                                            value={mbti}
                                            onChange={e => setMbti(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer text-[13px]"
                                        >
                                            {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowMbtiTest(true)}
                                            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline mt-1.5 ml-1 flex items-center gap-1 w-fit"
                                        >
                                            <span>🤔</span> MBTI를 모르시나요? 테스트하러 가기
                                        </button>
                                    </div>

                                    {/* Referrer */}
                                    <div className="relative">
                                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="추천인 닉네임 (선택)"
                                            value={referrer}
                                            onChange={e => setReferrer(e.target.value)}
                                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2 px-4 pl-11 text-white focus:outline-none focus:border-emerald-500 transition-colors text-[13px]"
                                        />
                                        {!referrer && (
                                            <div className="px-1 mt-0.5">
                                                <p className="text-[10px] text-slate-600 italic flex items-center gap-1">
                                                    <span>🔮</span> 추천인 입력 시 두 분 모두에게 수정구슬 5개가 지급됩니다.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Agreements */}
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="tos"
                                                checked={agreedTos}
                                                onChange={e => setAgreedTos(e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                                            />
                                            <label htmlFor="tos" className="text-[11px] text-slate-400">
                                                <button
                                                    type="button"
                                                    onClick={() => onShowNotice?.('tos')}
                                                    className="text-emerald-400 hover:underline inline-block mr-1 font-bold"
                                                >
                                                    이용약관
                                                </button>
                                                에 동의합니다 (필수)
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="privacy"
                                                checked={agreedPrivacy}
                                                onChange={e => setAgreedPrivacy(e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                                            />
                                            <label htmlFor="privacy" className="text-[11px] text-slate-400">
                                                <button
                                                    type="button"
                                                    onClick={() => onShowNotice?.('privacy')}
                                                    className="text-emerald-400 hover:underline inline-block mr-1 font-bold"
                                                >
                                                    개인정보 처리방침
                                                </button>
                                                에 동의합니다 (필수)
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-2.5 mt-1 font-bold text-[13px]"
                            disabled={isLoading}
                        >
                            {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입 완료')}
                        </Button>

                        <div className="text-center pt-3 border-t border-white/5 mt-3 space-y-3">
                            {!socialUser && (
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center bg-white border border-[#dadce0] rounded-xl hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                    style={{ height: '40px' }}
                                >
                                    <div className="px-3 flex items-center justify-center border-r border-transparent">
                                        <svg width="18" height="18" viewBox="0 0 18 18">
                                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.331C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                            <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.963H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.037l3.007-2.331z" fill="#FBBC05" />
                                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.963L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335" />
                                        </svg>
                                    </div>
                                    <span className="flex-1 text-[#3c4043] font-medium text-sm text-center pr-10">
                                        Google 계정으로 시작하기
                                    </span>
                                </button>
                            )}

                            <div className="text-center">
                                <p className="text-slate-500 text-[10px] mb-1">
                                    {isLogin ? '처음이신가요?' : (socialUser ? '프로필을 완성해주세요' : '이미 회원이신가요?')}
                                </p>
                                {!socialUser && (
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(!isLogin)}
                                        className={`text-xs font-bold transition-all hover:underline ${isLogin ? 'text-emerald-400 hover:text-emerald-300' : 'text-indigo-400 hover:text-indigo-300'}`}
                                    >
                                        {isLogin ? '회원가입하고 혜택받기' : '로그인하러 가기'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* MBTI Test Modal */}
            {showMbtiTest && (
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
            )}
        </>
    );
});

export default AuthModal;
