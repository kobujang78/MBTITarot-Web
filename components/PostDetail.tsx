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
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        if (post && isOpen) {
            setLikes(post.likes);
            fetchComments();
        }
    }, [post, isOpen]);

    const fetchComments = async () => {
        if (!post) return;
        try {
            const data = await getComments(post.id);
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !userProfile || !newComment.trim() || !post) return;

        setIsSubmitting(true);
        try {
            await addComment(post.id, currentUser.id, userProfile.nickname, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async () => {
        if (!post) return;
        try {
            await likePost(post.id);
            setLikes(prev => prev + 1);
        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    const handleDelete = async () => {
        if (!post || !window.confirm("정말로 이 글을 삭제하시겠습니까?")) return;
        try {
            await deletePost(post.id);
            onDeleteSuccess();
            onClose();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    const isAuthor = currentUser && userProfile && post && (currentUser.id === post.authorUid);
    const isAdmin = userProfile && userProfile.nickname === '관리자';
    const canManage = isAuthor || isAdmin;

    if (!isOpen || !post) return null;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
            <div
                className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-3 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] font-bold rounded border border-indigo-500/20 uppercase">
                        {post.category}
                    </span>
                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Post Content */}
                    <div className="p-5 md:p-6">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                                <User className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[13px] font-bold text-slate-200">{post.authorNickname}</span>
                                    <span className="text-[9px] text-indigo-500 font-serif font-bold uppercase">{post.authorMbti}</span>
                                </div>
                                <div className="text-[9px] text-slate-500 flex items-center gap-1">
                                    {formatDate(post.createdAt)}
                                </div>
                            </div>

                            {canManage && (
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(post)}
                                        className="text-[11px] font-bold text-slate-500 hover:text-indigo-400 px-2 py-1 transition-all"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-[11px] font-bold text-slate-500 hover:text-rose-400 px-2 py-1 transition-all"
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-white mb-3 leading-tight">
                            {post.title}
                        </h2>

                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                            {post.content}
                        </p>

                        <div className="flex items-center gap-4 py-3 border-t border-white/5">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-all group"
                            >
                                <Heart className={`w-4 h-4 ${likes > post.likes ? 'fill-rose-500 text-rose-500' : ''} group-hover:scale-110 transition-transform`} />
                                <span className="text-[13px] font-bold">{likes}</span>
                            </button>
                            <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-[11px] font-medium">{comments.length}개의 댓글</span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-slate-900/30 p-5 md:p-6 space-y-4">
                        <h3 className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                            <MessageSquare className="w-3.5 h-3.5" /> 댓글 {comments.length}
                        </h3>

                        {comments.length === 0 ? (
                            <div className="py-8 text-center text-slate-500 text-sm">
                                첫 번째 댓글을 남겨보세요!
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="group">
                                        <div className="flex justify-between items-start mb-1 px-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[12px] font-bold text-slate-300">{comment.authorNickname}</span>
                                                <span className="text-[9px] text-slate-600">{formatDate(comment.createdAt)}</span>
                                            </div>
                                        </div>
                                        <p className="text-[12px] text-slate-400 leading-relaxed bg-slate-800/20 p-2.5 rounded-xl border border-white/5">
                                            {comment.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Comment Input */}
                <div className="p-3 border-t border-white/5 bg-slate-950">
                    {currentUser ? (
                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="따뜻한 댓글을 남겨주세요"
                                className="flex-1 bg-slate-900 border border-slate-800/50 rounded-xl px-4 py-1.5 text-[12px] text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl transition-all shadow-lg text-[12px] font-bold text-white flex items-center gap-1"
                            >
                                <Send className="w-3.5 h-3.5" /> 전송
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-xs text-slate-500">로그인 후 댓글을 남길 수 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
