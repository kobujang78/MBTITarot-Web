import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    increment,
    runTransaction,
    Timestamp,
    startAfter,
    QueryConstraint
} from 'firebase/firestore';
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
            authorUid,
            authorNickname,
            authorMbti,
            title,
            content,
            category,
            likes: 0,
            commentCount: 0,
            createdAt: serverTimestamp(),
            sharedTarot: sharedTarot || null
        };

        const docRef = await addDoc(collection(db, 'posts'), postData);
        return docRef.id;
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
    lastDoc?: any,
    pageSize: number = 20
): Promise<{ posts: Post[], lastVisible: any }> => {
    try {
        const constraints: QueryConstraint[] = [
            orderBy('createdAt', 'desc'),
            limit(pageSize)
        ];

        if (category) {
            constraints.unshift(where('category', '==', category));
        }

        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        const q = query(collection(db, 'posts'), ...constraints);
        const querySnapshot = await getDocs(q);

        const posts: Post[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Post[];

        return {
            posts,
            lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1]
        };
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
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            title,
            content,
            category,
            updatedAt: serverTimestamp()
        });
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
        const postRef = doc(db, 'posts', postId);
        await deleteDoc(postRef);
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
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: increment(1)
        });
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
        return await runTransaction(db, async (transaction) => {
            const postRef = doc(db, 'posts', postId);
            const postSnap = await transaction.get(postRef);

            if (!postSnap.exists()) {
                throw new Error("Post does not exist");
            }

            // 1. Add comment
            const commentData = {
                postId,
                authorUid,
                authorNickname,
                content,
                createdAt: serverTimestamp()
            };

            const commentsRef = collection(db, 'comments');
            const newCommentRef = doc(commentsRef);
            transaction.set(newCommentRef, commentData);

            // 2. Increment comment count
            transaction.update(postRef, {
                commentCount: increment(1)
            });

            return newCommentRef.id;
        });
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
        const q = query(
            collection(db, 'comments'),
            where('postId', '==', postId),
            orderBy('createdAt', 'asc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Comment[];
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};
