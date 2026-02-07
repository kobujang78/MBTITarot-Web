import React, { useState, useEffect } from 'react';
import { Post, PostCategory } from '../types';
import { getPosts, likePost } from '../services/postService';
import { Heart, MessageSquare, User, Clock, ChevronRight, Plus, Filter, Search, Bell, Megaphone } from 'lucide-react';
import Button from './Button';

interface BoardListProps {
    onPostClick: (post: Post) => void;
    onWriteClick: () => void;
}

const BoardList: React.FC<BoardListProps> = ({ onPostClick, onWriteClick }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [category, setCategory] = useState<PostCategory | '전체'>('전체');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const categories: (PostCategory | '전체')[] = ['전체', '공지사항', '자유게시판', '고민상담', '결과자랑'];

    const fetchPosts = async (isMore = false) => {
        setIsLoading(true);
        try {
            const selectedCategory = category === '전체' ? undefined : category;
            const currentPage = isMore ? page + 1 : 0;
            const result = await getPosts(selectedCategory, currentPage);

            if (isMore) {
                setPosts(prev => [...prev, ...result.posts]);
                setPage(currentPage);
            } else {
                setPosts(result.posts);
                setPage(0);
            }
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [category]);

    const handleLike = async (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        try {
            await likePost(postId);
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return '방금 전';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
        return date.toLocaleDateString();
    };

    // 공지사항을 상단으로 정렬하는 로직 (전체 보기일 때)
    const sortedPosts = [...posts].sort((a, b) => {
        if (category === '전체') {
            if (a.category === '공지사항' && b.category !== '공지사항') return -1;
            if (a.category !== '공지사항' && b.category === '공지사항') return 1;
        }
        return 0; // 기본적으로는 최신순 (이미 가져올 때 최신순임)
    });

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4 animate-fadeIn">
            {/* Header & Filter */}
            <div className="flex flex-row items-center justify-between gap-2 mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white leading-tight">
                        운명의 광장
                    </h2>
                    <p className="text-slate-500 text-[10px]">MBTI와 타로 이야기를 나누어보세요</p>
                </div>

                <button
                    onClick={onWriteClick}
                    className="text-[12px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" /> 글쓰기
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1.5 scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`
                            px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border
                            ${category === cat
                                ? 'bg-slate-100 text-slate-900 border-white shadow-sm'
                                : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:border-slate-600'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main List */}
            {isLoading && posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500">이야기를 불러오는 중...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-700">
                    <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400">아직 등록된 게시글이 없습니다.<br />첫 번째 주인공이 되어보세요!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {sortedPosts.map((post) => {
                        const isNotice = post.category === '공지사항';
                        return (
                            <div
                                key={post.id}
                                onClick={() => onPostClick(post)}
                                className={`
                                    group border p-5 rounded-2xl transition-all cursor-pointer shadow-xl
                                    ${isNotice
                                        ? 'bg-indigo-900/20 border-indigo-500/40 hover:bg-indigo-900/30 hover:border-indigo-500'
                                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-indigo-500/30'}
                                `}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`
                                            px-1.5 py-0.5 text-[9px] font-bold rounded border uppercase flex items-center gap-1
                                            ${isNotice
                                                ? 'bg-indigo-500 text-white border-indigo-400'
                                                : 'bg-slate-800 text-indigo-400/80 border-indigo-500/10'}
                                        `}>
                                            {isNotice && <Megaphone className="w-2.5 h-2.5" />}
                                            {post.category}
                                        </span>
                                        <span className="text-slate-500 text-[9px] flex items-center gap-1">
                                            {formatDate(post.createdAt)}
                                        </span>
                                    </div>
                                    {isNotice && (
                                        <span className="text-indigo-400 text-[10px] font-bold animate-pulse">
                                            IMPORTANT
                                        </span>
                                    )}
                                </div>

                                <h3 className={`
                                    text-base font-bold mb-1 truncate transition-colors
                                    ${isNotice ? 'text-indigo-100 group-hover:text-white' : 'text-slate-200 group-hover:text-indigo-300'}
                                `}>
                                    {post.title}
                                </h3>

                                <p className="text-slate-400 text-[12px] line-clamp-1 mb-3 leading-relaxed">
                                    {post.content}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`
                                            w-6 h-6 rounded-full flex items-center justify-center border
                                            ${isNotice ? 'bg-indigo-500/30 border-indigo-500/50' : 'bg-slate-800 border-white/5'}
                                        `}>
                                            <User className={`w-3 h-3 ${isNotice ? 'text-white' : 'text-indigo-400'}`} />
                                        </div>
                                        <div className="flex flex-row items-center gap-1.5">
                                            <span className="text-[11px] font-bold text-slate-300">{post.authorNickname}</span>
                                            <span className="text-[9px] text-indigo-500 font-serif font-bold uppercase">{post.authorMbti}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {!isNotice && (
                                            <>
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <Heart className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-medium">{post.likes}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-medium">{post.commentCount}</span>
                                                </div>
                                            </>
                                        )}
                                        {isNotice && (
                                            <span className="text-indigo-400/60 text-[10px] font-medium">관리자 전용 공지</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {hasMore && (
                        <button
                            onClick={() => fetchPosts(true)}
                            className="w-full py-4 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? '불러오는 중...' : '더 많은 글 보기'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BoardList;
