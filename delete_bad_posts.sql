-- Supabase Cleanup Script (Removing Low-Quality Repetitive Posts)
-- This script deletes the posts that were recently generated with numbered/repetitive titles.

-- 1. Delete associated comments first
DELETE FROM comments
WHERE post_id IN (
    SELECT id FROM posts 
    WHERE title LIKE '자유게시판 심층 게시물: %'
       OR title LIKE '고민상담 심층 게시물: %'
       OR title LIKE '결과자랑 심층 게시물: %'
       OR title LIKE '%번째 깊이 있는 타로%'
       OR title LIKE '%번째 당신의 아픔에%'
       OR title LIKE '%번째 소름 돋는 타로%'
);

-- 2. Delete the posts themselves
DELETE FROM posts
WHERE title LIKE '자유게시판 심층 게시물: %'
   OR title LIKE '고민상담 심층 게시물: %'
   OR title LIKE '결과자랑 심층 게시물: %'
   OR title LIKE '%번째 깊이 있는 타로%'
   OR title LIKE '%번째 당신의 아픔에%'
   OR title LIKE '%번째 소름 돋는 타로%';
