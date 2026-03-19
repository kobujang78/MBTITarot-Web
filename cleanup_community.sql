-- Supabase Community Content Cleanup Script
-- This script removes the previous "numbered" or "placeholder" posts.

-- 1. Delete comments associated with the placeholder posts
DELETE FROM comments
WHERE post_id IN (
    SELECT id FROM posts 
    WHERE title LIKE '%활성화 게시물%' 
       OR title LIKE 'MBTI 유형별 타로 성향 이야기 %'
       OR title LIKE '고민상담: 마음의 지도가 필요할 때 %'
       OR title LIKE '대박! 오늘 리딩 결과 너무 소름 돋아요 %'
);

-- 2. Delete the placeholder posts themselves
DELETE FROM posts
WHERE title LIKE '%활성화 게시물%' 
   OR title LIKE 'MBTI 유형별 타로 성향 이야기 %'
   OR title LIKE '고민상담: 마음의 지도가 필요할 때 %'
   OR title LIKE '대박! 오늘 리딩 결과 너무 소름 돋아요 %';

-- Note: This ensures only the highest quality, unique posts remain.
