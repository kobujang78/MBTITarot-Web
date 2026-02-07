import { supabase } from './supabase';
import { Post, Comment, PostCategory } from '../types';

/**
 * Create a new post
 */
export const createPost = async (
    authorUid: string,
    authorNickname: string,
    authorMbti: string,
    title: string,
    content: string,
    category: PostCategory,
    sharedTarot?: string
): Promise<string> => {
    try {
        const postData = {
            author_id: authorUid,
            author_nickname: authorNickname,
            author_mbti: authorMbti,
            title,
            content,
            category,
            likes: 0,
            comment_count: 0,
            shared_tarot: sharedTarot || null
        };

        const { data, error } = await supabase
            .from('posts')
            .insert(postData)
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

/**
 * Get list of posts with optional category filtering and pagination
 */
export const getPosts = async (
    category?: PostCategory,
    page: number = 0,
    pageSize: number = 20
): Promise<{ posts: Post[], hasMore: boolean }> => {
    try {
        let query = supabase
            .from('posts')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (category) {
            query = query.eq('category', category);
        }

        const { data, count, error } = await query;

        if (error) throw error;

        const posts: Post[] = (data || []).map(post => ({
            id: post.id,
            authorUid: post.author_id,
            authorNickname: post.author_nickname,
            authorMbti: post.author_mbti,
            title: post.title,
            content: post.content,
            category: post.category as PostCategory,
            likes: post.likes,
            commentCount: post.comment_count,
            createdAt: post.created_at,
            sharedTarot: post.shared_tarot
        }));

        const hasMore = count ? (page + 1) * pageSize < count : false;

        return { posts, hasMore };
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

/**
 * Update an existing post
 */
export const updatePost = async (
    postId: string,
    title: string,
    content: string,
    category: PostCategory
) => {
    try {
        const { error } = await supabase
            .from('posts')
            .update({
                title,
                content,
                category
            })
            .eq('id', postId);

        if (error) throw error;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

/**
 * Increment like count for a post
 */
export const likePost = async (postId: string) => {
    try {
        const { error } = await supabase.rpc('increment_post_likes', { post_id: postId });

        if (error) throw error;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }
};

/**
 * Add a comment to a post
 */
export const addComment = async (
    postId: string,
    authorUid: string,
    authorNickname: string,
    content: string
): Promise<string> => {
    try {
        const commentData = {
            post_id: postId,
            author_id: authorUid,
            author_nickname: authorNickname,
            content
        };

        const { data, error } = await supabase
            .from('comments')
            .insert(commentData)
            .select('id')
            .single();

        if (error) throw error;

        // Increment comment count on the post
        await supabase.rpc('increment_post_comment_count', { post_id: postId });

        return data.id;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

/**
 * Get comments for a specific post
 */
export const getComments = async (postId: string): Promise<Comment[]> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return (data || []).map(comment => ({
            id: comment.id,
            postId: comment.post_id,
            authorUid: comment.author_id,
            authorNickname: comment.author_nickname,
            content: comment.content,
            createdAt: comment.created_at
        }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};
