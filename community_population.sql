-- Supabase Community Content Population Script (ROBUST VERSION)
-- This script adds realistic, high-quality posts and comments to the community boards.

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
    l_content TEXT := '커뮤니티의 건강한 소통을 위해 작성된 고품질 게시물입니다. MBTI의 과학적 분석과 타로 카드의 상징적 직관이 만났을 때 우리는 자신에 대해 더 깊이 이해할 수 있습니다. 각 성격 유형별로 나타나는 독특한 반응들을 살펴보는 것은 매우 흥미로운 일이죠. 예를 들어, INFP 유형은 타로 카드의 미묘한 상징에 깊이 공감하는 경향이 있고, ESTJ 유형은 카드가 제시하는 현실적인 조언과 행동 지표에 더 집중하곤 합니다. 이런 차이점들이 모여 우리 커뮤니티를 더욱 풍성하게 만듭니다. 여러분의 소중한 경험과 리딩 결과를 자유롭게 나누어주세요. 함께 성장하는 공간이 되길 바랍니다. ';
BEGIN
    -- [공지사항]
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        gen_random_uuid(), master_id, '마스터', 'INTJ', 
        '커뮤니티 이용 수칙 및 매너 안내 (필독)', 
        '안녕하세요, 운영팀입니다. 모두가 즐겁고 유익하게 이용할 수 있는 커뮤니티를 만들기 위해 몇 가지 기본 수칙을 안내드립니다. 1. 서로의 MBTI 성향과 개인적인 고민을 존중해 주세요. 비방이나 혐오 표현은 엄격히 금지됩니다. 2. 타로 리딩 결과는 개인마다 다르게 해석될 수 있으므로, 열린 마음으로 소통해 주시기 바랍니다. 3. 운영상 부적절한 게시물은 통보 없이 삭제될 수 있습니다. 여러분의 적극적인 협조 부탁드립니다. 감사합니다.', 
        '공지사항', 12, 0, (current_timestamp - INTERVAL '20 days')
    );

    -- [자유게시판]
    FOR i IN 1..15 LOOP
        post_id := gen_random_uuid();
        INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
        VALUES (
            post_id, 
            CASE WHEN i % 3 = 0 THEN sajang_id WHEN i % 3 = 1 THEN nari_id ELSE cobujang_id END, 
            CASE WHEN i % 3 = 0 THEN '박사장' WHEN i % 3 = 1 THEN '나리' ELSE '타로맨' END,
            CASE WHEN i % 3 = 0 THEN 'ENTJ' WHEN i % 3 = 1 THEN 'ENFP' ELSE 'ESTJ' END,
            'MBTI 유형별 타로 성향 이야기 ' || i, 
            l_content || ' (추가 내용: ' || i || '번째 에피소드 공유합니다.)', 
            '자유게시판', floor(random() * 25), 1, (current_timestamp - (i || ' days')::interval)
        );
        INSERT INTO comments (id, post_id, author_id, author_nickname, content, created_at)
        VALUES (gen_random_uuid(), post_id, hong3999_id, '선_3999', '와 정말 재미있는 분석이네요! 공감하고 갑니다. (' || i || ')', (current_timestamp - (i || ' days')::interval + INTERVAL '1 hour'));
    END LOOP;

    -- [고민상담]
    FOR i IN 1..15 LOOP
        post_id := gen_random_uuid();
        INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
        VALUES (
            post_id, 
            CASE WHEN i % 2 = 0 THEN hong2075_id ELSE hong3999_id END, 
            CASE WHEN i % 2 = 0 THEN '선_2075' ELSE '선_3999' END,
            CASE WHEN i % 2 = 0 THEN 'INFP' ELSE 'INFJ' END,
            '고민상담: 마음의 지도가 필요할 때 ' || i, 
            '요즘 들어 고민이 많아져서 타로를 보게 되었어요. MBTI 결과랑 같이 보니까 제가 왜 특정 상황에서 이런 스트레스를 받는지 조금은 알 것 같기도 하네요. 다른 분들은 이럴 때 어떤 카드가 조언으로 나왔나요? ' || l_content, 
            '고민상담', floor(random() * 18), 1, (current_timestamp - (i || ' days')::interval)
        );
        INSERT INTO comments (id, post_id, author_id, author_nickname, content, created_at)
        VALUES (gen_random_uuid(), post_id, master_id, '마스터', '고민이 깊으시군요. 타로의 지혜가 빛이 되어주길 바랍니다. (' || i || ')', (current_timestamp - (i || ' days')::interval + INTERVAL '2 hours'));
    END LOOP;

    -- [결과자랑]
    FOR i IN 1..15 LOOP
        post_id := gen_random_uuid();
        INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
        VALUES (
            post_id, 
            CASE WHEN i % 2 = 0 THEN sajang_id ELSE nari_id END, 
            CASE WHEN i % 2 = 0 THEN '박사장' ELSE '나리' END,
            CASE WHEN i % 2 = 0 THEN 'ENTJ' ELSE 'ENFP' END,
            '대박! 오늘 리딩 결과 너무 소름 돋아요 ' || i, 
            '결과자랑하러 왔습니다! 방금 뽑은 결과가 제 현재 상황이랑 너무 딱 맞아서 깜짝 놀랐습니다. 역시 MBTI 맞춤 리딩이라 그런지 디테일이 다르네요. ' || l_content, 
            '결과자랑', floor(random() * 35), 1, (current_timestamp - (i || ' days')::interval)
        );
        INSERT INTO comments (id, post_id, author_id, author_nickname, content, created_at)
        VALUES (gen_random_uuid(), post_id, cobujang_id, '타로맨', '축하드려요! 좋은 기운 저도 받아갑니다~ (' || i || ')', (current_timestamp - (i || ' days')::interval + INTERVAL '3 hours'));
    END LOOP;

END $$;
