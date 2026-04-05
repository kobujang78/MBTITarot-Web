-- Supabase Community Content Population Script - Human-like Long-form Posts (BATCH 3)
-- Categories: 자유게시판, 고민상담, 결과자랑 (4 posts each)

DO $$
DECLARE
    -- User IDs
    nari_id UUID := 'd99a03c8-bb80-414c-b707-e9ea31922484';
    hong2075_id UUID := 'fcfbcec3-4cc2-4826-b844-a45d67ce0683';
    sajang_id UUID := '53072dce-c834-4766-9df5-90b2c8aa7055';
    hong3999_id UUID := '853f14e7-8711-4480-ac5d-df335c1302f8';
    cobujang_id UUID := 'd8b76ff7-4665-4d13-9cf6-fdc3dee0751b';
    master_id UUID := '074ac781-e0fe-4a30-98bd-d519ad4571d1';
    
    post_id UUID;
    
    -- Content blocks for variety (BATCH 3)
    b_intro_v3_1 TEXT := '안녕하세요 여러분! 벌써 세 번째 성찰의 기록을 남기게 되었네요. 타로와 MBTI의 세계는 파면 팔수록 정말 끝이 없는 것 같아요. 오늘은 제가 우연히 발견한 "동시성"의 원리와 우리 성격의 관계에 대해 좀 더 깊이 있는 이야기를 해보려고 합니다. ';
    b_intro_v3_2 TEXT := '오늘 아침, 문득 카드를 한 장 뽑으며 이런 생각이 들더군요. 과연 우리는 이 작은 카드 조각에 우리의 무엇을 투영하고 있는 걸까요? MBTI라는 체계적인 툴과 타로라는 직관적인 상징이 만났을 때 생기는 보이지 않는 시너지를 분석해보았습니다. ';
    b_intro_v3_3 TEXT := '반갑습니다! 오늘도 저와 함께 타로의 상징 속으로 여행을 떠나보실래요? 가끔은 분석적인 머리를 잠시 쉬게 하고, 카드의 그림과 색채가 전해주는 날것의 메시지에 귀를 기울여보는 것도 좋더라구요. 특히 내면의 어두운 부분을 마주하는 방법에 대해 정리해봤습니다. ';
    
    b_sync TEXT := ' 타로와 우리 삶 사이의 묘한 일치감은 칼 융이 말한 "동시성"과 깊은 연관이 있습니다. 우리는 단순한 확률이라고 치부할 수도 있지만, 정말로 간절할 때 뽑은 카드가 현재 내 상황과 절묘하게 맞아떨어지는 경험은 우주가 나에게 보내는 은밀한 윙크처럼 느껴지기도 하죠. 이것은 MBTI에서 말하는 우리의 인지 방식과도 연결됩니다. 직관형(N)인 분들은 이런 흐름을 민감하게 포착하며 미래의 가능성을 읽어내고, 감각형(S)인 분들은 현재의 구체적인 선택지에 집중하며 현실적인 안정감을 찾습니다. 이 모든 과정이 결국 하나로 이어져 있다는 것이 정말 경이롭지 않나요? ';
    b_visual TEXT := ' 라이더-웨이트 타로 카드를 자세히 들여다보면, 색채 하나하나에도 심오한 철학이 담겨 있습니다. 배경의 황금색은 신성한 지혜와 희망을, 푸른색은 감정의 깊이와 평온함을 나타내죠. 붉은색은 지상의 정열과 행동력을 의미합니다. MBTI의 각 기능들도 이와 비슷한 에너지를 가지고 있습니다. 사고(T) 기능은 명료한 선과 구조를 가진 검(Swords) 슈트와 닮아 있고, 감정(F) 기능은 유연하고 깊은 컵(Cups) 슈트와 공명합니다. 단순히 의미를 외우는 것을 넘어 그림 자체와 대화하다 보면, 우리 무의식이 어떤 색채를 갈망하고 있는지 알 수 있게 됩니다. ';
    b_shadow TEXT := ' 우리는 보통 밝고 긍정적인 면만을 보려 하지만, 타로의 진정한 힘은 "악마"나 "달", "탑" 같은 카드가 보여주는 우리의 그림자(Shadow)를 직면하게 하는 데 있습니다. MBTI 기능에서 우리가 평소에 잘 쓰지 못하고 억눌러둔 열등 기능이나 3차 기능이 이 그림자를 통해 나타나곤 합니다. 논리적인 사람일수록 감정의 소용돌이에 휘말릴 때 더 큰 혼란을 겪고, 감성적인 사람일수록 차가운 현실 앞에서 무력해지기 쉽죠. 하지만 이 그림자를 인정하고 통합하는 순간, 우리는 비로소 온전한 자아로 거듭날 수 있습니다. 카드는 그 아픈 진실을 부드럽게, 때로는 날카롭게 비춰주는 거울입니다. ';
    b_transformation TEXT := ' 인생은 끊임없는 변형의 과정입니다. 죽음 카드는 끝이 아니라 낡은 것을 버리고 새것을 맞이하는 전환점을, 심판 카드는 과거의 나를 뛰어넘어 진정한 소명을 찾는 부활을 의미합니다. 이러한 변화의 주기는 우리 MBTI 유형이 환경에 적응하며 진화해나가는 과정과 매우 흡사합니다. 안락한 지대에 머무르지 않고 용기 있게 도전을 선택할 때, 타로 리딩은 우리가 나아가야 할 방향에 대한 힌트를 제공합니다. 고통 뒤에 오는 절제 카드의 평온함처럼, 우리 삶의 모든 시련은 결국 더 큰 조화를 향한 필연적인 단계임을 잊지 마세요. ';
    
    b_outro_v3_1 TEXT := ' 오늘도 긴 글 끝까지 함께 해주셔서 감사합니다. 저의 작은 통찰이 여러분의 오늘 하루에 기분 좋은 영감이 되었기를 바랍니다. 타로와 MBTI라는 든든한 친구들과 함께, 여러분만의 아름다운 인생 지도를 그려나가시길 응원합니다. 다음에 또 만나요! ';
    b_outro_v3_2 TEXT := ' 결국 중요한 것은 우리가 스스로를 얼마나 깊이 이해하고 사랑하느냐인 것 같습니다. 카드의 결과보다 그 결과를 통해 내가 무엇을 느끼고 어떻게 행동할지를 고민하는 하루가 되셨으면 좋겠어요. 여러분의 모든 걸음걸음이 축복이기를 진심으로 기도합니다. ';
    b_outro_v3_3 TEXT := ' 여러분의 생각도 궁금합니다. 혹시 최근에 뽑은 카드 중에 정말 기억에 남는 한 장이 있다면 댓글로 알려주세요! 서로의 이야기를 나누다 보면 우리 모두의 무의식이 연결되어 있다는 걸 더 생생하게 느낄 수 있을 테니까요. 행복한 주말 보내세요! ';

BEGIN
    -- [자유게시판] Post 1 (ISTJ 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ISTJ', 
        'ISTJ가 고찰한 타로의 색채 심리학과 MBTI 인지 보완 시스템의 완벽한 결합', 
        b_intro_v3_1 || repeat(b_visual, 6) || repeat(b_sync, 4) || b_outro_v3_1 || repeat(b_visual, 2), 
        '자유게시판', 52, 0, (current_timestamp - INTERVAL '4 hours')
    );

    -- [자유게시판] Post 2 (ENFJ 코부장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, cobujang_id, '코부장', 'ENFJ', 
        '함께 성장하는 영혼의 동반자: ENFJ가 제안하는 타로 스터디와 MBTI 유형별 시너지', 
        b_intro_v3_2 || repeat(b_transformation, 5) || repeat(b_sync, 5) || b_outro_v3_2 || repeat(b_transformation, 2), 
        '자유게시판', 68, 0, (current_timestamp - INTERVAL '9 hours')
    );

    -- [자유게시판] Post 3 (INFP 선_2075)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong2075_id, '선_2075', 'INFP', 
        '꿈과 현실 사이를 잇는 무지개 다리: INFP의 감수성으로 풀어낸 타로의 비가시적 상징들', 
        b_intro_v3_3 || repeat(b_unconscious, 4) || repeat(b_visual, 6) || b_outro_v3_3 || repeat(b_shadow, 2), 
        '자유게시판', 75, 0, (current_timestamp - INTERVAL '14 hours')
    );

    -- [자유게시판] Post 4 (ESFJ 사장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, sajang_id, '사장', 'ESFJ', 
        '커뮤니티 매너와 타로 에티켓: 모두가 행복한 리딩을 위한 ESFJ의 따뜻한 제언', 
        b_intro_v3_1 || repeat(b_sync, 7) || repeat(b_practical_v2, 4) || b_outro_v3_1, 
        '자유게시판', 41, 0, (current_timestamp - INTERVAL '19 hours')
    );

    -- [고민상담] Post 1 (INFJ 은_3999) - MBTI was null, using INFJ for character
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong3999_id, '은_3999', 'INFJ', 
        '외로운 밤, 타로의 달빛 아래서 나를 마주하다: INFJ의 심연을 치유하는 리딩 가이드', 
        b_intro_v3_2 || repeat(b_shadow, 8) || ' 그 어둠조차 저의 일부임을 깨닫는 고통스러운 과정이었습니다. ' || repeat(b_transformation, 2) || b_outro_v3_2, 
        '고민상담', 89, 0, (current_timestamp - INTERVAL '3 hours')
    );

    -- [고민상담] Post 2 (ENFJ 마스터)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, master_id, '마스터', 'ENFJ', 
        '번아웃 뒤에 숨겨진 진정한 갈망: 타로 카드가 제안하는 휴식과 재도약의 MBTI 솔루션', 
        b_intro_v3_3 || repeat(b_transformation, 7) || repeat(b_practical_v2, 3) || b_outro_v3_3, 
        '고민상담', 102, 0, (current_timestamp - INTERVAL '8 hours')
    );

    -- [고민상담] Post 3 (INFP 선_2075)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong2075_id, '선_2075', 'INFP', 
        '사랑이라는 미로 속에서 길을 잃은 그대에게: 타로 리딩으로 확인하는 감정의 우선순위', 
        b_intro_v3_1 || repeat(b_sync, 6) || repeat(b_journey, 4) || b_outro_v3_1 || repeat(b_visual, 2), 
        '고민상담', 95, 0, (current_timestamp - INTERVAL '13 hours')
    );

    -- [고민상담] Post 4 (ISTJ 나리)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, nari_id, '나리', 'ISTJ', 
        '성격 차이로 인한 갈등 해결법: 타로 카드의 상징을 이용한 객관적인 관계 중재 보고서', 
        b_intro_v3_2 || repeat(b_practical_v2, 8) || repeat(b_mbti_dynamic, 2) || b_outro_v3_2, 
        '고민상담', 58, 0, (current_timestamp - INTERVAL '18 hours')
    );

    -- [결과자랑] Post 1 (ENFJ 코부장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, cobujang_id, '코부장', 'ENFJ', 
        '대박 예고! 타로 리딩이 보여준 "운명의 수레바퀴"가 가져다준 기적 같은 선물', 
        b_intro_v3_3 || repeat(b_sync, 11) || b_outro_v3_3, 
        '결과자랑', 162, 0, (current_timestamp - INTERVAL '2 hours')
    );

    -- [결과자랑] Post 2 (ESFJ 사장)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, sajang_id, '사장', 'ESFJ', 
        '소름 돋는 연애 대박 적중! 타로 조언대로 했더니 썸남과 1일 되었어요!', 
        b_intro_v3_1 || repeat(b_visual, 9) || b_outro_v3_1, 
        '결과자랑', 188, 0, (current_timestamp - INTERVAL '7 hours')
    );

    -- [결과자랑] Post 3 (ENFJ 마스터)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, master_id, '마스터', 'ENFJ', 
        '잃어버린 열정을 되찾은 최고의 리딩 경험: 타로 카드가 일깨워준 제 2의 인생 비전', 
        b_intro_v3_2 || repeat(b_transformation, 10) || b_outro_v3_2, 
        '결과자랑', 145, 0, (current_timestamp - INTERVAL '12 hours')
    );

    -- [결과자랑] Post 4 (INFJ 은_3999)
    post_id := gen_random_uuid();
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (
        post_id, hong3999_id, '은_3999', 'INFJ', 
        '침묵 속에서 들려온 응답: 타로 리딩과 명상을 통해 깨달은 내면의 커다란 변화', 
        b_intro_v3_3 || repeat(b_shadow, 7) || repeat(b_journey, 4) || b_outro_v3_3, 
        '결과자랑', 128, 0, (current_timestamp - INTERVAL '17 hours')
    );

END $$;
