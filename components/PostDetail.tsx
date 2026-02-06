import React, { useState, useEffect } from 'react';
import { Post, Comment, UserProfile } from '../types';
import { getComments, addComment, likePost, deletePost } from '../services/postService';
import { X, Heart, MessageSquare, Send, User, Clock, Trash2, Edit2, ShieldCheck, MoreVertical } from 'lucide-react';
import Button from './Button';

interface PostDetailProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (post: Post) => void;
    onDeleteSuccess: () => void;
    currentUser: any;
    userProfile: UserProfile | null;
}

const PostDetail: React.FC<PostDetailProps> = ({
    post,
    isOpen,
    onClose,
    onEdit,
    onDeleteSuccess,
    currentUser,
    userProfile
}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const isAuthor = currentUser && post && currentUser.uid === post.authorId;
    const isAdmin = userProfile?.nickname === '관리자';

    useEffect(() => {
        if (isOpen && post) {
            loadComments();
        }
    }, [isOpen, post]);

    const loadComments = async () => {
        if (!post) return;
        setIsLoadingComments(true);
        try {
            const data = await getComments(post.id);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !post || !newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addComment(post.id, currentUser.uid, userProfile?.nickname || '익명', newComment);
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!post || !window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deletePost(post.id);
            onDeleteSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
            <div
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Background Gradient */}
                <div className="relative p-6 pt-10 border-b border-white/5 bg-gradient-to-br from-indigo-900/10 via-slate-900 to-slate-900">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 mb-4">
                        <span className={`
                            px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                            ${post.category === '공지사항'
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}
                        `}>
                            {post.category}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif leading-tight">
                        {post.title}
                    </h2>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold text-slate-200">{post.authorName}</span>
                                    {post.authorName === '관리자' && <ShieldCheck className="w-3 h-3 text-rose-400" />}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="font-bold text-indigo-400/70">{post.authorMbti || 'MBTI'}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(post.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {(isAuthor || isAdmin) && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(post)}
                                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                                    title="수정"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                                    title="삭제"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>

                    {/* Like Button Interation in Post */}
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={(e) => likePost(post.id)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-rose-500/50 group-hover:bg-rose-500/5 transition-all">
                                <Heart className={`w-6 h-6 ${post.likes > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500 group-hover:text-rose-400'}`} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 group-hover:text-rose-400">{post.likes} Likes</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                            <MessageSquare className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold text-white">댓글 <span className="text-indigo-400">{comments.length}</span></h3>
                        </div>

                        {/* Comment List */}
                        <div className="space-y-4">
                            {isLoadingComments ? (
                                [1, 2].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse"></div>)
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="group bg-slate-800/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-200">{comment.authorName}</span>
                                                <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                                                    {comment.authorName === '관리자' ? 'ADMIN' : 'MEMBER'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-600">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800 text-slate-600 text-sm">
                                    첫 번째 댓글의 주인공이 되어보세요!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Input Area */}
                <div className="p-4 bg-slate-800/50 border-t border-white/5 sticky bottom-0">
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={currentUser ? "따뜻한 댓글을 남겨주세요..." : "로그인이 필요합니다."}
                                disabled={!currentUser || isSubmitting}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!currentUser || !newComment.trim() || isSubmitting}
                            className="px-4 py-2.5"
                            size="sm"
                        >
                            {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </form>
                    {!currentUser && (
                        <p className="text-[10px] text-slate-500 mt-2 text-center">커뮤니티 이용을 위해 로그인이 필요합니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
