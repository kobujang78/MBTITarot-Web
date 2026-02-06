import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { X, Mail, Lock, User, Sparkles, ChevronRight, LogIn, Github } from 'lucide-react';
import Button from './Button';
import { createUserProfile, checkNicknameExists } from '../services/userService';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setNickname('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                onClose();
            } else {
                // Register
                const trimmedNickname = nickname.trim();
                if (trimmedNickname.length < 2) {
                    throw new Error('닉네임은 최소 2자 이상이어야 합니다.');
                }

                // Check nickname duplicate
                const exists = await checkNicknameExists(trimmedNickname);
                if (exists) {
                    throw new Error('이미 사용 중인 닉네임입니다.');
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Create profile in database
                await createUserProfile(user.uid, email, trimmedNickname);
                
                // Update firebase profile display name
                await firebaseUpdateProfile(user, { displayName: trimmedNickname });
                
                onClose();
            }
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') setError('이미 사용 중인 이메일입니다.');
            else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            else if (err.code === 'auth/weak-password') setError('비밀번호는 최소 6자 이상이어야 합니다.');
            else setError(err.message || '인증에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if profile exists, if not create basic one
            try {
                // Note: checkNicknameExists is not enough here, usually we check if UID exists in DB
                // For simplicity, we create if doesn't exist within the service call itself
                await createUserProfile(user.uid, user.email || '', user.displayName || 'Guest');
            } catch (pErr) {
                console.log("Profile might already exist, skipping creation.");
            }
            
            onClose();
        } catch (err: any) {
            console.error(err);
            setError('구글 로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
            <div 
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
                                {isLogin ? '반가워요!' : '환영합니다!'}
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">당신의 운명을 기록하고 공유하세요</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-2xl text-red-200 text-xs flex items-center gap-3">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">!</div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="사용하실 닉네임"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="email" 
                                placeholder="이메일 주소"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="password" 
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full py-4 rounded-2xl shadow-indigo-900/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Sparkles className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? '로그인' : '회원가입 완료'}
                                    <ChevronRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Or Continue With</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-2xl transition-all text-sm text-slate-300 font-medium"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale opacity-70" />
                            Google
                        </button>
                        <button 
                            className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-2xl transition-all text-sm text-slate-300 font-medium opacity-50 cursor-not-allowed"
                            disabled
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-slate-800/30 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm">
                        {isLogin ? '계정이 없으신가요?' : '이미 회원이신가요?'}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 underline-offset-4 hover:underline transition-all"
                        >
                            {isLogin ? '회원가입하기' : '로그인하기'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
