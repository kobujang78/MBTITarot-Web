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
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<PostCategory | '전체'>('전체');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadPosts();
    }, [activeTab]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await getPosts(activeTab === '전체' ? undefined : activeTab);
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        try {
            await likePost(postId);
            setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, likes: p.likes + 1 } : p
            ));
        } catch (error) {
            console.error(error);
        }
    };

    // Filter posts locally by search query
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories: (PostCategory | '전체')[] = ['전체', '공지사항', '자유게시판', '고민상담', '결과자랑'];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fadeIn">
            {/* Board Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white font-serif flex items-center gap-3">
                        타로 커뮤니티
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full font-sans uppercase tracking-widest font-bold">Lounge</span>
                    </h2>
                    <p className="text-slate-400 text-sm">MBTI와 타로로 연결되는 우리의 특별한 이야기</p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="글 제목, 내용, 작성자 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    <Button onClick={onWriteClick} className="flex items-center gap-2 whitespace-nowrap px-6">
                        <Plus className="w-4 h-4" />
                        글쓰기
                    </Button>
                </div>
            </div>

            {/* Announcements Section (Featured) */}
            {activeTab === '전체' && !searchQuery && posts.some(p => p.category === '공지사항') && (
                <div className="mb-8 p-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl">
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-[14px] p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                            <Megaphone className="w-3.5 h-3.5" />
                            Notice
                        </div>
                        <div className="space-y-2">
                            {posts.filter(p => p.category === '공지사항').slice(0, 2).map(notice => (
                                <div
                                    key={notice.id}
                                    onClick={() => onPostClick(notice)}
                                    className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                                >
                                    <h3 className="text-slate-200 text-sm font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                        {notice.title}
                                    </h3>
                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`
                            px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                            ${activeTab === cat
                                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105'
                                : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Posts List Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 4, 5].map(i => (
                        <div key={i} className="h-40 bg-slate-900/40 rounded-3xl animate-pulse border border-slate-800"></div>
                    ))}
                </div>
            ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => onPostClick(post)}
                            className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-6 rounded-3xl transition-all duration-300 cursor-pointer group shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`
                                    px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                                    ${post.category === '공지사항' ? 'bg-rose-500/20 text-rose-400' :
                                        post.category === '고민상담' ? 'bg-emerald-500/20 text-emerald-400' :
                                            'bg-indigo-500/20 text-indigo-400'}
                                `}>
                                    {post.category}
                                </span>
                                <div className="flex items-center gap-3 text-slate-500 text-xs">
                                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                                {post.content}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <User className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-300">{post.authorName}</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-70">
                                            {post.authorMbti || 'MBTI'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => handleLike(e, post.id)}
                                        className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                                        <span className="text-xs font-bold">{post.likes}</span>
                                    </button>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs font-bold">{post.commentCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                    <Filter className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                    <p className="text-sm mt-1 opacity-60">다른 키워드나 태그로 검색해보세요.</p>
                </div>
            )}
        </div>
    );
};

export default BoardList;
