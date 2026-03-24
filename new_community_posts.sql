-- Supabase Community Content Population Script - Human-like Long-form Posts
-- Categories: 자유게시판, 고민상담, 결과자랑 (4 posts each)

DO $$
DECLARE
    -- User IDs
    nari_id UUID := 'd99a03c8-bb80-414c-b707-e9ea31922484';
    sajang_id UUID := '53072dce-c834-4766-9df5-90b2c8aa7055';
    hong3999_id UUID := '853f14e7-8711-4480-ac5d-df335c1302f8';
    hong2075_id UUID := 'fcfbcec3-4cc2-4826-b844-a45d67ce0683';
    master_id UUID := '074ac781-e0fe-4a30-98bd-d519ad4571d1';
    cobujang_id UUID := 'd8b76ff7-4665-4d13-9cf6-fdc3dee0751b';
    
    post_id UUID;
    
    -- Content blocks for variety
    b_intro_1 TEXT := '안녕하세요, 평소에 타로와 MBTI에 관심이 많은 한 유저입니다. 오늘은 제가 평소에 생각하던 "운명과 성격의 상관관계"에 대해 조금 긴 글을 써보려고 해요. 사실 우리는 매일 수많은 선택을 하며 살아가잖아요? 그 선택들이 모여 우리의 삶을 구성하고, 그 과정에서 우리의 성취나 고민이 만들어지곤 합니다. ';
    b_intro_2 TEXT := '오늘따라 마음이 싱숭생숭해서 글을 남겨봅니다. 타로 카드를 뒤적이다 보면 참 신기하다는 생각이 들 때가 많아요. 단순히 운세를 보는 도구를 넘어서, 내면의 깊은 곳을 비춰주는 거울 같다고나 할까요? 특히 MBTI 성향에 따라 카드를 받아들이는 방식이 다르다는 점이 흥미롭습니다. ';
    b_intro_3 TEXT := '혹시 여러분도 그런 경험 있으신가요? 정말로 간절하게 원하던 답을 타로에서 얻었을 때의 그 짜릿함 말이에요! 오늘은 제가 겪은 놀라운 상담 결과와, 그 과정에서 느낀 점들을 공유해볼까 합니다. 사람의 마음이라는 게 참 알다가도 모를 일이지만, 가끔은 이런 상징들이 큰 이정표가 되어줍니다. ';
    
    b_philosophy TEXT := ' 타로의 메이저 아르카나 카드를 공부하다 보면, 우리 인생의 영웅적 여정이 고스란히 담겨 있다는 것을 알게 됩니다. 바보 카드에서 시작해 세계 카드에 이르기까지, 우리는 성장하고 실패하고 다시 일어서는 과정을 반복하죠. MBTI가 우리의 "엔진"이라면, 타로는 우리가 가고 있는 "길" 위의 날씨와 지형을 보여줍니다. 내향적인 성향을 가진 분들은 카드의 상징을 내면화하여 깊은 성찰을 얻는 데 능숙하시더라고요. 반면 외향적인 분들은 이 상징들을 현실적인 소통의 도구로 활용하며 주변과의 조화를 찾는 데 뛰어난 모습을 보입니다. 이런 상호작용이 모여 우리의 인생이 더욱 다채로워지는 것이겠죠. ';
    b_practical TEXT := ' 현실적으로 타로를 활용한다는 것은, 단지 미래를 맞히는 게임이 아닙니다. 현재 내가 처한 상황을 객관적으로 바라보고, 내 무의식이 어떤 방향을 지향하고 있는지 확인하는 일이죠. 예를 들어, 결정적인 순간에 "칼" 카드가 나온다면 이는 이성적인 결단이 필요함을 암시합니다. 하지만 "컵" 카드가 연달아 나온다면, 자신의 감정을 먼저 보듬어야 한다는 신호일 수 있습니다. 이러한 해석의 과정이 MBTI의 사고(T)와 감정(F) 기능과 맞물려 돌아갈 때, 우리는 비로소 균형 잡힌 시각을 가질 수 있습니다. 데이터의 축적과 직관의 발휘, 이 두 가지가 만나는 지점이 바로 타로의 매력이라고 생각합니다. ';
    b_healing TEXT := ' 마음이 힘들 때 우리는 대화를 원합니다. 하지만 가끔은 타로 카드의 그림 한 장이 백 마디 말보다 더 큰 위로를 줄 때가 있죠. 별 카드의 희망이나, 절제 카드의 평온함 같은 것들 말입니다. 아픔은 누구에게나 예고 없이 찾아오지만, 그것을 어떻게 받아들이고 치유하느냐는 우리의 몫입니다. 감수성이 풍부한 NF 성향의 분들은 특히 카드의 미묘한 분위기에 민감하게 반응하시는데, 이런 공감 능력이 스스로를 치유하는 강력한 에너지가 됩니다. 당신의 내면에는 이미 답이 있습니다. 카드는 단지 그 답을 끄집어내는 마중물 역할을 할 뿐입니다. 스스로를 믿고 한 걸음씩 나아가세요. ';
    
    b_outro_1 TEXT := ' 긴 글 읽어주셔서 감사합니다. 타로와 MBTI라는 도구를 통해 여러분도 자신만의 소중한 가치를 발견하셨으면 좋겠어요. 우리 모두 각자의 자리에서 반짝이는 삶을 살아가길 응원합니다. 다음에 또 좋은 생각이나 경험이 있으면 나누러 올게요! 소중한 하루 보내세요. ';
    b_outro_2 TEXT := ' 결국 중요한 것은 카드의 결과가 아니라, 그 결과를 받아들이는 우리의 자세인 것 같습니다. 긍정적인 메시지는 동력으로 삼고, 경고의 메시지는 지혜로운 대비책으로 삼는다면 어떤 운명도 우리를 가둬둘 수 없습니다. 여러분의 앞날에 항상 밝은 기운만 가득하기를 진심으로 빌어봅니다. ';
    b_outro_3 TEXT := ' 여러분의 생각은 어떠신가요? 저와 비슷한 경험을 하신 분들이 있다면 댓글로 자유롭게 소통했으면 좋겠습니다. 서로의 이야기를 듣는 것만으로도 큰 힘이 될 때가 많으니까요. 오늘도 자신을 사랑하는 마음 잊지 마시고, 즐거운 타로 생활 하시길 바랍니다! ';

BEGIN
    -- [자유게시판] Post 1 (ENTJ 박사장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, sajang_id, '박사장', 'ENTJ', 
        '비즈니스 효율을 극대화하는 타로 리딩과 MBTI 전략: 리더의 시각에서 본 통찰', 
        b_intro_1 || repeat(b_practical, 5) || repeat(b_philosophy, 4) || b_outro_1 || repeat(b_practical, 3), 
        '자유게시판', 42, 0, (current_timestamp - INTERVAL '4 hours')
    );

    -- [자유게시판] Post 2 (ENFP 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ENFP', 
        '상상력의 한계란 없다! 타로 카드 78장으로 그려본 우리들의 파노라마', 
        b_intro_2 || repeat(b_philosophy, 6) || repeat(b_healing, 4) || b_outro_3 || repeat(b_philosophy, 2), 
        '자유게시판', 55, 0, (current_timestamp - INTERVAL '8 hours')
    );

    -- [자유게시판] Post 3 (INTJ 마스터)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, master_id, '마스터', 'INTJ', 
        '논리적 비약인가, 직관적 통찰인가: 타로 상징계에 대한 회의적 접근과 재구축', 
        b_intro_1 || repeat(b_practical, 4) || repeat(b_philosophy, 5) || ' 특히 구조적 관점에서 아르카나의 배열은 인간 발달 단계와 밀접하게 연동됩니다. ' || repeat(b_practical, 3) || b_outro_2, 
        '자유게시판', 61, 0, (current_timestamp - INTERVAL '12 hours')
    );

    -- [자유게시판] Post 4 (ESTJ 타로맨)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, cobujang_id, '타로맨', 'ESTJ', 
        '체계적인 타로 리딩 학습법: 뜬구름 잡는 소리는 거두고 실질적인 해석력을 키우는 법', 
        b_intro_3 || repeat(b_practical, 8) || ' 실전에서 바로 활용 가능한 기법들을 정리해 보았습니다. ' || repeat(b_philosophy, 2) || b_outro_1, 
        '자유게시판', 38, 0, (current_timestamp - INTERVAL '16 hours')
    );

    -- [고민상담] Post 1 (INFP 선_2075)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong2075_id, '선_2075', 'INFP', 
        '유리 멘탈인 제가 이별을 견뎌내는 법: 타로가 건네준 조용한 위로의 손길', 
        b_intro_2 || repeat(b_healing, 9) || ' 너무 아프지만 그래도 견뎌보려 합니다. ' || repeat(b_philosophy, 2) || b_outro_3, 
        '고민상담', 74, 0, (current_timestamp - INTERVAL '3 hours')
    );

    -- [고민상담] Post 2 (INFJ 선_3999)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong3999_id, '선_3999', 'INFJ', 
        '진로의 갈림길에서 길을 잃은 당신에게: 내면의 소리를 듣는 타로 명상 가이드', 
        b_intro_1 || repeat(b_healing, 5) || repeat(b_philosophy, 6) || b_outro_2, 
        '고민상담', 82, 0, (current_timestamp - INTERVAL '7 hours')
    );

    -- [고민상담] Post 3 (ENFP 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ENFP', 
        '인간관계 권태기인가요? 저와 함께 타로로 마음의 활력을 되찾아봐요!', 
        b_intro_3 || repeat(b_healing, 6) || repeat(b_philosophy, 4) || b_outro_1 || repeat(b_healing, 2), 
        '고민상담', 49, 0, (current_timestamp - INTERVAL '11 hours')
    );

    -- [고민상담] Post 4 (INFP 선_2075)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong2075_id, '선_2075', 'INFP', 
        '자존감이 바닥을 치는 밤, 제가 타로 카드를 보며 눈물 흘린 이유', 
        b_intro_2 || repeat(b_healing, 10) || ' 스스로를 사랑한다는 건 참 어려운 일 같아요. ' || b_outro_3, 
        '고민상담', 93, 0, (current_timestamp - INTERVAL '15 hours')
    );

    -- [결과자랑] Post 1 (ENTJ 박사장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, sajang_id, '박사장', 'ENTJ', 
        '소름 돋는 비즈니스 예측 적중! 신규 사업 확정 전 타로가 보여준 승전보', 
        b_intro_3 || repeat(b_practical, 10) || ' 역시 데이터와 직관의 조합은 무적입니다. ' || b_outro_1, 
        '결과자랑', 105, 0, (current_timestamp - INTERVAL '2 hours')
    );

    -- [결과자랑] Post 2 (ENFP 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ENFP', 
        '꺅! 짝사랑 성공했어요! 타로가 알려준 고백 타이밍이 정말 완벽했네요', 
        b_intro_3 || repeat(b_healing, 8) || repeat(b_philosophy, 3) || b_outro_3, 
        '결과자랑', 128, 0, (current_timestamp - INTERVAL '6 hours')
    );

    -- [결과자랑] Post 3 (ESTJ 타로맨)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, cobujang_id, '타로맨', 'ESTJ', 
        '부동산 계약 성공 후기: 리스크를 관리해준 타로의 현실적인 조언과 보수적 리딩', 
        b_intro_1 || repeat(b_practical, 11) || b_outro_2, 
        '결과자랑', 88, 0, (current_timestamp - INTERVAL '10 hours')
    );

    -- [결과자랑] Post 4 (INFJ 선_3999)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong3999_id, '선_3999', 'INFJ', 
        '먼 곳에서 찾아온 귀인과의 만남: 타로 카드의 예언이 실현된 신비로운 주말 경험', 
        b_intro_2 || repeat(b_philosophy, 7) || repeat(b_healing, 4) || b_outro_1, 
        '결과자랑', 112, 0, (current_timestamp - INTERVAL '14 hours')
    );

END $$;
