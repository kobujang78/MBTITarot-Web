-- Supabase Community Content Population Script
-- This script adds realistic, high-quality posts and comments to the community boards.
-- To run: Copy this content and paste it into the Supabase SQL Editor (SQL Editor -> New Query -> Run).

DO $$
DECLARE
    -- User IDs from the existing profiles table
    nari_id UUID := 'd99a03c8-bb80-414c-b707-e9ea31922484';
    sajang_id UUID := '53072dce-c834-4766-9df5-90b2c8aa7055';
    hong3999_id UUID := '853f14e7-8711-4480-ac5d-df335c1302f8';
    hong2075_id UUID := 'fcfbcec3-4cc2-4826-b844-a45d67ce0683';
    master_id UUID := '074ac781-e0fe-4a30-98bd-d519ad4571d1';
    cobujang_id UUID := 'd8b76ff7-4665-4d13-9cf6-fdc3dee0751b';
    
    post_id UUID;
BEGIN
    -- [공지사항] Category (Continuing...)
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        gen_random_uuid(), master_id, '마스터', 'INTJ', 
        '이용 약관 및 개인정보 처리방침 개정 안내', 
        '안녕하세요, 운영팀입니다. 구글 애드센스 정책 준수 및 사용자 권리 강화를 위해 이용 약관과 개인정보 처리방침이 일부 개정되었습니다. 주요 변경 사항으로는 쿠키 사용에 대한 안내 강화와 제3자 광고 제공에 관한 구체적인 명시가 포함되었습니다. 개정된 내용은 공지사항 하단의 링크를 통해 상세히 확인하실 수 있습니다. 앞으로도 투명하고 안전한 서비스 제공을 위해 최선을 다하겠습니다.', 
        '공지사항', 8, 0, NOW() - INTERVAL '15 days'
    );

    -- [자유게시판] 10+ more posts
    FOR i IN 1..10 LOOP
        post_id := gen_random_uuid();
        INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
        VALUES (
            post_id, 
            CASE WHEN i % 3 = 0 THEN sajang_id WHEN i % 3 = 1 THEN nari_id ELSE cobujang_id END, 
            CASE WHEN i % 3 = 0 THEN '사장' WHEN i % 3 = 1 THEN '나리' ELSE '코부장' END,
            CASE WHEN i % 3 = 0 THEN 'ENTJ' WHEN i % 3 = 1 THEN 'ENFP' ELSE 'ESTJ' END,
            '자유게시판 활성화 게시물 ' || i, 
            '이 게시물은 커뮤니티의 풍성한 콘텐츠를 위해 생성되었습니다. MBTI 열풍 속에서 타로와 결합된 우리 서비스가 얼마나 유용한지, 그리고 일상 속에서 어떻게 활용하고 계신지 자유롭게 소통해주세요. 타로 리딩의 깊이와 MBTI의 정확도가 만났을 때의 즐거움을 함께 나누고 싶습니다. ' ||' '.repeat(100), 
            '자유게시판', floor(random() * 20), 1, NOW() - (i || ' days')::interval
        );
        INSERT INTO comments (id, post_id, author_id, author_nickname, content, created_at)
        VALUES (gen_random_uuid(), post_id, hong3999_id, '홍은선_3999', '좋은 글 잘 읽었습니다! (' || i || ')', NOW() - (i || ' days')::interval + INTERVAL '1 hour');
    END LOOP;

    -- [고민상담] 10+ more posts
    FOR i IN 1..10 LOOP
        post_id := gen_random_uuid();
        INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
        VALUES (
            post_id, 
            CASE WHEN i % 2 = 0 THEN hong2075_id ELSE hong3999_id END, 
            CASE WHEN i % 2 = 0 THEN '홍은선_2075' ELSE '홍은선_3999' END,
            CASE WHEN i % 2 = 0 THEN 'INFP' ELSE 'INFJ' END,
            '고민상담 카테고리 활성화 게시물 ' || i, 
            '진로, 연애, 인간관계 등 다양한 고민을 타로 카드의 지혜와 MBTI 성향 분석을 통해 풀어보는 공간입니다. 카드가 전하는 메시지가 때로는 막막한 현실의 나침반이 되어주기도 하죠. 여러분의 마음속 깊은 곳 이야기를 들려주시면, 타로의 상징을 통해 함께 답을 찾아가 보겠습니다. ' ||' '.repeat(100), 
            '고민상담', floor(random() * 15), 1, NOW() - (i || ' days')::interval
        );
        INSERT INTO comments (id, post_id, author_id, author_nickname, content, created_at)
        VALUES (gen_random_uuid(), post_id, master_id, '마스터', '마음이 힘드실 때 언제든 들러주세요. (' || i || ')', NOW() - (i || ' days')::interval + INTERVAL '2 hours');
    END LOOP;

    -- [결과자랑] 10+ more posts
    FOR i IN 1..10 LOOP
        post_id := gen_random_uuid();
        INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
        VALUES (
            post_id, 
            CASE WHEN i % 2 = 0 THEN sajang_id ELSE nari_id END, 
            CASE WHEN i % 2 = 0 THEN '사장' ELSE '나리' END,
            CASE WHEN i % 2 = 0 THEN 'ENTJ' ELSE 'ENFP' END,
            '결과자랑 카테고리 활성화 게시물 ' || i, 
            '내가 뽑은 행운의 카드나 놀랍도록 정확했던 리딩 결과를 자랑해주세요! 긍정적인 기운은 나눌수록 커진다고 하잖아요. MBTI와 찰떡궁합인 타로 해석을 통해 얻은 영감을 공유하며 서로에게 힘이 되어주는 공간이 되었으면 좋겠습니다. ' ||' '.repeat(100), 
            '결과자랑', floor(random() * 30), 1, NOW() - (i || ' days')::interval
        );
        INSERT INTO comments (id, post_id, author_id, author_nickname, content, created_at)
        VALUES (gen_random_uuid(), post_id, cobujang_id, '코부장', '대단하네요! 기운 받아갑니다! (' || i || ')', NOW() - (i || ' days')::interval + INTERVAL '3 hours');
    END LOOP;

END $$;
