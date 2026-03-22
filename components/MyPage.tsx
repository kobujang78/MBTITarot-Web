import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, Sparkles, Calendar, Eye, ArrowLeft, LogOut, Award, Star, Edit2, Check, X as XIcon } from 'lucide-react';
import Button from './Button';
import { supabase } from '../services/supabase';
import { MBTI_TYPES } from '../constants';
import { checkNicknameExists, updateUserProfile } from '../services/userService';
import { MBTI_TAROT_STYLES } from './LandingContent';

interface MyPageProps {
    userProfile: UserProfile;
    onBack: () => void;
}

const MyPage: React.FC<MyPageProps> = React.memo(({ userProfile, onBack }) => {
    const [localImage, setLocalImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editNickname, setEditNickname] = useState(userProfile.nickname);
    const [editMbti, setEditMbti] = useState(userProfile.mbti || '');
    const [nicknameError, setNicknameError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const savedImage = localStorage.getItem(`profile_img_${userProfile.uid}`);
        if (savedImage) setLocalImage(savedImage);
    }, [userProfile.uid]);

    // Reset edit state when opening/closing
    useEffect(() => {
        if (!isEditing) {
            setEditNickname(userProfile.nickname);
            setEditMbti(userProfile.mbti || '');
            setNicknameError(null);
        }
    }, [isEditing, userProfile]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('파일 크기가 너무 큽니다 (최대 2MB)');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setLocalImage(base64String);
            localStorage.setItem(`profile_img_${userProfile.uid}`, base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        // Validation
        const trimmedNickname = editNickname.trim();
        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            setNicknameError('닉네임은 2~10자로 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            // Check nickname uniqueness only if changed
            if (trimmedNickname !== userProfile.nickname) {
                const exists = await checkNicknameExists(trimmedNickname);
                if (exists) {
                    setNicknameError('이미 사용 중인 닉네임입니다.');
                    setIsSaving(false);
                    return;
                }
            }

            // Update Profile
            await updateUserProfile(userProfile.uid, {
                nickname: trimmedNickname,
                mbti: editMbti
            });

            setIsEditing(false);
            // Parent App component listens to snapshot, so it should auto-update UI
            alert("프로필이 수정되었습니다.");

        } catch (error) {
            console.error("Profile update failed:", error);
            alert("프로필 수정 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const joinDate = new Date(userProfile.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-4 animate-fadeIn pb-24">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={onBack}
                    className="p-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-700"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">마이페이지</h2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            title="프로필 수정"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                                title="취소"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-colors disabled:opacity-50"
                                title="저장"
                            >
                                {isSaving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-4">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 border-b border-white/5">
                    <div className="flex flex-col items-center">
                        <div className="relative group/avatar mb-2">
                            <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center border-2 border-indigo-500/30 overflow-hidden shadow-xl transition-all group-hover/avatar:border-indigo-400">
                                {localImage ? (
                                    <img src={localImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-indigo-400" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 transition-all scale-90 group-hover/avatar:scale-100"
                                title="사진 변경"
                            >
                                <Star className="w-3 h-3 fill-current" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>

                        {/* Editable Area */}
                        <div className="text-center w-full max-w-xs">
                            {isEditing ? (
                                <div className="space-y-3 mt-2 animate-fadeIn">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editNickname}
                                            onChange={(e) => {
                                                setEditNickname(e.target.value);
                                                setNicknameError(null);
                                            }}
                                            className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-1.5 text-center text-white text-sm focus:border-indigo-500 focus:outline-none"
                                            placeholder="닉네임 (2-10자)"
                                        />
                                        {nicknameError && (
                                            <p className="text-[10px] text-rose-400 mt-1 absolute w-full">{nicknameError}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-center">
                                        <div className="grid grid-cols-4 gap-1 w-full p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 max-h-[120px] overflow-y-auto custom-scrollbar">
                                            {MBTI_TYPES.filter(t => t !== '공통').map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setEditMbti(type)}
                                                    className={`
                                                        px-1 py-1.5 rounded text-[10px] font-bold transition-all
                                                        ${editMbti === type
                                                            ? 'bg-indigo-600 text-white shadow-md scale-105'
                                                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}
                                                    `}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-1">
                                        {userProfile.nickname}님
                                    </h3>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] font-bold rounded border border-indigo-500/20 uppercase tracking-tighter">
                                            {userProfile.mbti || 'MBTI 미설정'}
                                        </span>
                                        {userProfile.nickname === '관리자' && (
                                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[9px] font-bold rounded border border-rose-500/20 flex items-center gap-1 transition-colors">
                                                <Award className="w-2.5 h-2.5" /> 관리자
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Crystal & Stats Bar */}
                <div className="px-4 py-5 bg-indigo-600/10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl shadow-lg border border-indigo-500/30 animate-pulse">
                            🔮
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">나의 에너지</p>
                            <p className="text-xl font-black text-white flex items-center gap-1.5">
                                {userProfile.crystals}<span className="text-xs font-bold text-slate-400">수정구슬</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => alert("매일 첫 로그인 시 5개의 수정구슬이 충전됩니다!")}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold transition-all shadow-lg active:scale-95"
                    >
                        구슬 충전하기
                    </button>
                </div>

                {/* MBTI Personality Card */}
                {userProfile.mbti && MBTI_TAROT_STYLES[userProfile.mbti] && (
                    <div className="p-5 bg-slate-800/20 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl p-2 bg-slate-800 rounded-2xl border border-white/5 shadow-inner">
                                {MBTI_TAROT_STYLES[userProfile.mbti].icon}
                            </span>
                            <div>
                                <h3 className="text-[13px] font-black text-slate-200 uppercase tracking-wider">
                                    {userProfile.mbti} : {MBTI_TAROT_STYLES[userProfile.mbti].title}
                                </h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Personal Oracle Profile</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5">
                                <h4 className="text-[10px] font-bold text-indigo-300 mb-1 flex items-center gap-1.5 uppercase">
                                    <Sparkles className="w-3 h-3" /> 당신만의 타로 스타일
                                </h4>
                                <p className="text-[12px] leading-relaxed text-slate-400 font-medium">
                                    {MBTI_TAROT_STYLES[userProfile.mbti].summary}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-500 mb-1 uppercase pl-1">상담을 대하는 태도</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed pl-1">
                                        {MBTI_TAROT_STYLES[userProfile.mbti].attitude}
                                    </p>
                                </div>
                                <div className="bg-indigo-900/10 p-3 rounded-xl border border-indigo-500/10">
                                    <h4 className="text-[10px] font-bold text-indigo-400 mb-1 uppercase">추천 질문 예시</h4>
                                    <p className="text-[11px] text-indigo-200/80 italic font-medium leading-relaxed">
                                        "{MBTI_TAROT_STYLES[userProfile.mbti].question.split('/')[0].trim()}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 grid grid-cols-2 gap-3 bg-slate-900/20">
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                            <Eye className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">총 방문</p>
                            <p className="text-[12px] font-bold text-slate-200">{userProfile.totalCount || 0}회</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">가입일</p>
                            <p className="text-[11px] font-bold text-slate-200 whitespace-nowrap">{joinDate}</p>
                        </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                            <Star className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">계정 정보</p>
                            <p className="text-[12px] font-bold text-slate-300 truncate">{userProfile.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefit Info Section */}
            <div className="mb-6 grid grid-cols-1 gap-2">
                <div className="p-4 bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-500/20 rounded-3xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-bold text-slate-200">매일매일 충전되는 기운!</h4>
                        <p className="text-[11px] text-slate-500">최초 로그인 시 구슬 5개가 지급됩니다.</p>
                    </div>
                </div>
            </div>

            {/* Marketing Consent Toggle */}
            <div className="mb-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h4 className="text-[13px] font-bold text-slate-200">마케팅 정보 수신</h4>
                        <p className="text-[10px] text-slate-500">이벤트 및 혜택 알림 (선택)</p>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        const newValue = !userProfile.marketingConsent;
                        await updateUserProfile(userProfile.uid, { marketingConsent: newValue });
                    }}
                    className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                        ${userProfile.marketingConsent ? 'bg-indigo-600' : 'bg-slate-700'}
                    `}
                >
                    <span
                        className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${userProfile.marketingConsent ? 'translate-x-6' : 'translate-x-1'}
                        `}
                    />
                </button>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-2">
                <Button
                    variant="secondary"
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center justify-center gap-1 bg-slate-800/80 border-slate-700 text-rose-400 flex-1 py-3 !px-0.5 !font-sans !tracking-normal hover:bg-rose-500/10 hover:border-rose-500/30"
                >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[13px] font-bold whitespace-nowrap">로그아웃</span>
                </Button>
                <Button
                    variant="primary"
                    onClick={onBack}
                    className="flex items-center justify-center gap-1 flex-1 py-3 !px-0.5 !font-sans !tracking-normal"
                >
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[13px] font-bold whitespace-nowrap">돌아가기</span>
                </Button>
            </div>

            <div className="mt-6 p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl">
                <p className="text-[10px] text-indigo-300/60 leading-relaxed text-center">
                    당신의 에너지는 언제나 변하고 있습니다.<br />
                    정기적인 타로 리딩을 통해 우주의 흐름을 확인해보세요.
                </p>
            </div>
        </div>
    );
});

export default MyPage;
