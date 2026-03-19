-- Supabase Ultimate Duplicate Cleanup Script
-- This script removes all posts with duplicate titles across ALL categories.
-- It keeps only the latest post (the one with the largest 'created_at') for each title.

-- 1. Delete comments for posts that are about to be deleted
DELETE FROM comments
WHERE post_id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as row_num
        FROM posts
    ) t
    WHERE t.row_num > 1
);

-- 2. Delete the duplicate posts, keeping only the most recent one for each title
DELETE FROM posts
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as row_num
        FROM posts
    ) t
    WHERE t.row_num > 1
);

-- Note: This will leave exactly one post for each unique title.
