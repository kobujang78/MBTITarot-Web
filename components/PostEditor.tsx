import React, { useState, useEffect } from 'react';
import { Post, PostCategory, UserProfile } from '../types';
import { createPost, updatePost } from '../services/postService';
import { X, Send, AlertCircle, Type, AlignLeft, Tag } from 'lucide-react';
import Button from './Button';

interface PostEditorProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: UserProfile;
    onSuccess: () => void;
    editingPost?: Post | null;
}

const PostEditor: React.FC<PostEditorProps> = ({ isOpen, onClose, userProfile, onSuccess, editingPost }) => {
    const isAdmin = userProfile.nickname === '관리자';
    const categories: PostCategory[] = isAdmin
        ? ['공지사항', '자유게시판', '고민상담', '결과자랑']
        : ['자유게시판', '고민상담', '결과자랑'];

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<PostCategory>(isAdmin ? '공지사항' : '자유게시판');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (editingPost) {
                setTitle(editingPost.title);
                setContent(editingPost.content);
                setCategory(editingPost.category);
            } else {
                setTitle('');
                setContent('');
                setCategory(isAdmin ? '공지사항' : '자유게시판');
            }
        }
    }, [isOpen, editingPost, isAdmin]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            if (editingPost) {
                await updatePost(editingPost.id, title, content, category);
            } else {
                await createPost(
                    userProfile.uid,
                    userProfile.nickname,
                    userProfile.mbti || 'MBTI',
                    title,
                    content,
                    category
                );
            }
            onSuccess();
            setTitle('');
            setContent('');
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(editingPost ? '게시글 수정 중 오류가 발생했습니다.' : '게시글 등록 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
            <div
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-white">{editingPost ? '게시글 수정' : '새로운 이야기'}</h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">당신의 이야기를 들려주세요</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 px-1">
                            <Tag className="w-3.5 h-3.5" /> 카테고리
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border
                                        ${category === cat
                                            ? 'bg-slate-100 text-slate-900 border-white'
                                            : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:border-slate-600'}
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 px-1">
                            <Type className="w-3.5 h-3.5" /> 제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="어떤 이야기를 나누고 싶으신가요?"
                            required
                            maxLength={50}
                            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5 flex-1 flex flex-col min-h-[200px]">
                        <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 px-1">
                            <AlignLeft className="w-3.5 h-3.5" /> 내용
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="자유롭게 이야기를 들려주세요..."
                            required
                            className="w-full flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-slate-800/50 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-[13px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        취소
                    </button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !title.trim() || !content.trim()}
                        className="px-6 py-2.5 text-[13px] font-bold"
                    >
                        {isLoading ? (editingPost ? '수정 중...' : '등록 중...') : (
                            <span className="flex items-center gap-1.5">
                                <Send className="w-3.5 h-3.5" /> {editingPost ? '수정 완료' : '게시하기'}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;
