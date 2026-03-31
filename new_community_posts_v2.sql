-- Supabase Community Content Population Script - Human-like Long-form Posts (BATCH 2)
-- Categories: 자유게시판, 고민상담, 결과자랑 (4 posts each)

DO $$
DECLARE
    -- User IDs
    cobujang_id UUID := 'd8b76ff7-4665-4d13-9cf6-fdc3dee0751b';
    nari_id UUID := 'd99a03c8-bb80-414c-b707-e9ea31922484';
    sajang_id UUID := '53072dce-c834-4766-9df5-90b2c8aa7055';
    hong3999_id UUID := '853f14e7-8711-4480-ac5d-df335c1302f8';
    hong2075_id UUID := 'fcfbcec3-4cc2-4826-b844-a45d67ce0683';
    master_id UUID := '074ac781-e0fe-4a30-98bd-d519ad4571d1';
    
    post_id UUID;
    
    -- Content blocks for variety (BATCH 2)
    b_intro_A TEXT := '요즘 들어 부쩍 타로와 MBTI에 대해 깊게 파고들고 있는 유저입니다. 예전에는 그냥 재미로만 보곤 했는데, 공부를 하면 할수록 이 둘의 조합이 주는 통찰력이 정말 대단하다는 걸 느껴요. 오늘은 제가 최근에 느낀 성찰의 기록을 조금 나누어보려 합니다. ';
    b_intro_B TEXT := '안녕하세요, 오늘은 평소와는 조금 다른 시각으로 타로 카드를 조망해볼까 해요. 우리는 명확한 답을 원하지만, 때로는 카드가 보여주는 모호함 속에서 더 큰 성장을 이루기도 하죠. MBTI 기능들과 타로의 상징들이 어떻게 우리 삶에서 춤추고 있는지 함께 이야기해보고 싶습니다. ';
    b_intro_C TEXT := '혹시 인생의 중요한 고비마다 타로 카드를 보며 마음을 다잡으시는 분들 계신가요? 저는 이번 주에 정말 커다란 선택을 앞두고 타로와 MBTI 분석을 병행해봤는데요, 그 과정에서 얻은 결론이 꽤나 흥미로워서 공유해봅니다. 생각보다 우리 삶은 정교하게 짜여진 패턴 같기도 해요. ';
    
    b_journey TEXT := ' 우리가 타로를 공부하는 과정은 마치 바보 카드의 모험과도 같습니다. 처음에는 아무것도 모르고 순수하게 시작하지만, 마법사를 거쳐 여황제, 그리고 운명의 수레바퀴를 지나며 우리는 인생의 굴곡을 배웁니다. 이것은 MBTI에서 말하는 성격의 분화와 발달 과정과도 맞물려 있습니다. 자신의 주기능을 발견하고, 열등 기능을 통합해 나가는 과정이 바로 타로의 메이저 아르카나가 보여주는 정신적 성숙의 단계와 일치합니다. 카드의 그림들은 수천 년간 내려온 인류의 지혜를 담고 있으며, 우리는 그 상징을 통해 현재 우리의 위치를 파악할 수 있습니다. 길을 잃었을 때 등불이 되어주는 것, 그것이 바로 타로의 진정한 가치입니다. ';
    b_mbti_dynamic TEXT := ' MBTI의 각각의 알파벳 성향은 타로 리딩에서도 뚜렷한 특징을 보입니다. 예를 들어 내향(I) 성향의 분들은 카드의 내밀한 분위기와 상징에 집중하여 깊은 내면의 치유를 경험하는 반면, 외향(E) 성향의 분들은 리딩 결과를 타인과의 관계 개선이나 현실적인 소통의 창구로 활용하곤 합니다. 감각(S)적인 시각에서는 카드의 구성 요소와 구체적인 정황을 포착하는 데 능숙하고, 직관(N)적인 시각에서는 전체적인 맥락과 보이지 않는 흐름을 읽어내는 데 탁월합니다. 이러한 인지 기능들이 타로의 상징과 결합될 때, 우리는 비로소 입체적인 자아 성찰의 기회를 가지게 됩니다. ';
    b_practical_v2 TEXT := ' 타로를 일상에서 실용적으로 활용하는 방법은 우리 무의식적인 편향을 확인하는 것입니다. 우리는 보고 싶은 것만 보고 믿고 싶은 것만 믿으려는 경향이 있지만, 무작위로 뽑힌 카드는 우리를 객관적인 시야로 강제 소환합니다. 중요한 비즈니스 결정을 앞두거나 인간관계에서 갈등이 생겼을 때, 타로 카드는 우리가 놓치고 있던 이면의 진실을 비춰줍니다. 사고(T) 기능이 강한 분들은 이를 데이터베이스화하여 전략적인 판단의 근거로 삼으시고, 감정(F) 기능이 강한 분들은 이를 자신의 감정 상태를 체크하는 리트머스 시험지로 삼아보세요. 도구는 쓰기 나름이지만, 타로는 그 어떤 도구보다도 유연하고 강력합니다. ';
    b_unconscious TEXT := ' 칼 융은 인간의 무의식 속에 존재하는 공통적인 이미지들을 "원형"이라고 불렀습니다. 타로 카드의 메이저 아르카나는 바로 이 원형들의 시각적 구현입니다. 황제 카드는 권위와 질서를, 달 카드는 불안과 무의식의 심연을 상징합니다. 우리가 카드를 뽑을 때 그것이 현재 상황과 절묘하게 맞아떨어지는 이유는 "동시성"의 원리로 설명될 수 있습니다. MBTI의 심리 유형론 또한 이러한 무의식의 구조를 분석하는 학문이죠. 타로 리딩을 통해 우리는 의식의 수면 아래 가라앉아 있던 고민의 실체를 끌어올려 직면할 수 있게 됩니다. 이것은 단순한 점술을 넘어선 고도의 심리적 훈련입니다. ';
    
    b_outro_A TEXT := ' 글이 많이 길어졌네요. 긴 내용 읽어주셔서 정말 감사합니다. 타로와 MBTI라는 환상적인 조합을 통해 저와 여러분 모두가 어제보다 조금 더 나은 오늘을 보내기를 진심으로 응원합니다. 오늘도 여러분만의 카드를 소중히 간직하세요. 감사합니다! ';
    b_outro_B TEXT := ' 결국 모든 리딩의 주인공은 우리 자신입니다. 카드가 무엇을 말하든, 그것을 삶의 지혜로 승화시키는 것은 우리의 몫이죠. 여러분의 앞날에 항상 태양 카드처럼 밝고 긍정적인 기운이 가득하기를 기원하며 글을 마칩니다. 댓글로 여러분의 생각도 많이 남겨주세요! ';
    b_outro_C TEXT := ' 오늘의 성찰이 여러분께 작은 도움이라도 되었다면 기쁘겠습니다. 우리는 모두 각자의 속도로 발전해나가는 중이며, 타로와 MBTI는 그 여정의 든든한 동반자가 되어줄 것입니다. 즐거운 하루 보내시고, 다음에도 재미있는 주제로 찾아뵙겠습니다. 행복하세요! ';

BEGIN
    -- [자유게시판] Post 1 (ENFJ 코부장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, cobujang_id, '코부장', 'ENFJ', 
        'ENFJ 리더가 경험한 커뮤니티 리딩의 힘: 타로와 MBTI로 보는 집단 무의식의 조화', 
        b_intro_A || repeat(b_mbti_dynamic, 4) || repeat(b_journey, 5) || b_outro_A || repeat(b_unconscious, 3), 
        '자유게시판', 65, 0, (current_timestamp - INTERVAL '1 day')
    );

    -- [자유게시판] Post 2 (ISTJ 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ISTJ', 
        'ISTJ의 시선으로 분석한 타로 상징의 체계성: 직관을 데이터로 치환하는 실험적 연구', 
        b_intro_B || repeat(b_practical_v2, 6) || repeat(b_mbti_dynamic, 4) || b_outro_B || repeat(b_practical_v2, 2), 
        '자유게시판', 48, 0, (current_timestamp - INTERVAL '2 days')
    );

    -- [자유게시판] Post 3 (ESFJ 사장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, sajang_id, '사장', 'ESFJ', 
        '인간관계 전문가가 알려주는 타로 소통법: ESFJ의 공감 능력을 극대화하는 리딩 비법', 
        b_intro_C || repeat(b_mbti_dynamic, 5) || repeat(b_unconscious, 4) || b_outro_C || repeat(b_journey, 2), 
        '자유게시판', 72, 0, (current_timestamp - INTERVAL '3 days')
    );

    -- [자유게시판] Post 4 (INTJ 홍은선_3999)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong3999_id, '홍은선_3999', 'INTJ', 
        '타로와 MBTI의 융합 아키텍처: 시스템 사고를 통한 미래 경로 최적화 전략', 
        b_intro_A || repeat(b_unconscious, 7) || repeat(b_practical_v2, 4) || b_outro_B, 
        '자유게시판', 81, 0, (current_timestamp - INTERVAL '4 days')
    );

    -- [고민상담] Post 1 (INFP 홍은선_2075)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong2075_id, '홍은선_2075', 'INFP', 
        '끝이 보이지 않는 터널 속에서 뽑은 "별" 카드: INFP가 전하는 간절한 희망의 편지', 
        b_intro_B || repeat(b_journey, 8) || ' 그날 밤 저는 정말 많이 울었습니다. ' || repeat(b_unconscious, 2) || b_outro_C, 
        '고민상담', 115, 0, (current_timestamp - INTERVAL '5 hours')
    );

    -- [고민상담] Post 2 (ENFJ 마스터)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, master_id, '마스터', 'ENFJ', 
        '중요한 선택의 기로에 선 당신에게: 타로 리딩을 통한 자기 객관화와 비전 수립', 
        b_intro_C || repeat(b_practical_v2, 7) || repeat(b_mbti_dynamic, 4) || b_outro_A, 
        '고민상담', 98, 0, (current_timestamp - INTERVAL '10 hours')
    );

    -- [고민상담] Post 3 (ISTJ 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ISTJ', 
        '현실적인 경제 고민과 타로의 조언: ISTJ가 분석한 운과 실력의 상관계수', 
        b_intro_A || repeat(b_practical_v2, 9) || b_outro_B, 
        '고민상담', 64, 0, (current_timestamp - INTERVAL '15 hours')
    );

    -- [고민상담] Post 4 (INFP 홍은선_2075)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong2075_id, '홍은선_2075', 'INFP', 
        '상처받은 내면 아이를 보듬는 시간: 타로 카드로 하는 MBTI 셀프 힐링 리포트', 
        b_intro_B || repeat(b_journey, 6) || repeat(b_unconscious, 5) || b_outro_C || repeat(b_mbti_dynamic, 2), 
        '고민상담', 124, 0, (current_timestamp - INTERVAL '20 hours')
    );

    -- [결과자랑] Post 1 (ESFJ 사장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, sajang_id, '사장', 'ESFJ', 
        '대박! 제가 추천해준 리딩대로 했더니 고백 성공했대요! ESFJ의 연애운 적중 후기', 
        b_intro_C || repeat(b_mbti_dynamic, 10) || b_outro_A, 
        '결과자랑', 145, 0, (current_timestamp - INTERVAL '2 hours')
    );

    -- [결과자랑] Post 2 (ENFJ 코부장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, cobujang_id, '코부장', 'ENFJ', 
        '승진 시험 합격! 타로 카드가 보여준 "전차" 카드의 에너지가 현실이 되었네요', 
        b_intro_A || repeat(b_journey, 9) || b_outro_B, 
        '결과자랑', 132, 0, (current_timestamp - INTERVAL '6 hours')
    );

    -- [결과자랑] Post 3 (INTJ 홍은선_3999)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong3999_id, '홍은선_3999', 'INTJ', 
        '부동산 투자 성공 사례 보고: 타로 리딩과 경제 지표의 동시성 분석을 통한 성과 달성', 
        b_intro_C || repeat(b_practical_v2, 11) || b_outro_C, 
        '결과자랑', 110, 0, (current_timestamp - INTERVAL '12 hours')
    );

    -- [결과자랑] Post 4 (ENFJ 마스터)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, master_id, '마스터', 'ENFJ', 
        '운명의 굴레를 벗어난 순간: 타로 리딩이 예견한 놀라운 인생 반전 성공기', 
        b_intro_B || repeat(b_unconscious, 8) || repeat(b_journey, 3) || b_outro_A, 
        '결과자랑', 158, 0, (current_timestamp - INTERVAL '18 hours')
    );

END $$;
