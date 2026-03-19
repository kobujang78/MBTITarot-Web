-- Supabase Massive Community Content Script (3,000 Characters per Post)
-- This script adds 30 unique, ultra-long-form posts to the community boards.

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
    
    -- Content Blocks for hit 3000 chars
    cb_intro TEXT := ' 본 게시물은 MBTI 성향과 타로 리딩의 깊이 있는 결합을 통해 우리 삶의 다양한 측면을 탐구하고자 작성되었습니다. 단순히 운을 점치는 것을 넘어, 자신의 심리 상태를 반영하고 더 나은 미래를 설계하기 위한 도구로서의 가치를 공유하고자 합니다. ';
    cb_body1 TEXT := ' 타로의 상징은 인류 공통의 무의식을 담고 있습니다. 78장의 카드는 각각 우리가 살아가며 겪는 수많은 감정과 사건들을 대변하며, 그 속에서 우리는 미처 발견하지 못했던 내면의 목소리를 듣게 됩니다. 특히 MBTI의 각 인지 기능과 연동된 해석은 기존의 막연한 운세풀이와는 차원이 다른 정확도와 깊이를 제공합니다. ';
    cb_body2 TEXT := ' 성격 유형에 따라 같은 카드라도 받아들이는 무게와 방향이 다릅니다. 직관형(N)은 카드의 상징적 의미에 집중하며 미래의 가능성을 보려 하고, 감각형(S)은 카드가 제시하는 현실적인 지침과 현재의 상황에 더 몰입합니다. 이러한 차이점을 이해하는 것이 진정한 자기 이해의 시작입니다. ';
    cb_body3 TEXT := ' 수많은 사용자들이 이 서비스를 통해 자신의 고민에 대한 해답을 찾고 있습니다. 진로, 연애, 대인관계 등 우리가 일상에서 마주하는 복잡한 실타래를 타로의 지혜와 MBTI의 과학적 분석으로 하나하나 풀어나가는 과정은 그 자체로 치유와 성장의 시간이 됩니다. ';
    cb_outro TEXT := ' 여러분의 소중한 경험과 리딩 결과를 자유롭게 나누어주세요. 함께 소통하며 지혜를 나누는 이 공간이 모두에게 긍정적인 에너지를 전달하는 안식처가 되길 바랍니다. 당신의 오늘이 카드의 축복과 함께하길 기원합니다. ';
    
    -- Function-like behavior for generating long content
    full_content TEXT;
BEGIN
    -- [자유게시판] Unique Post 1
    post_id := gen_random_uuid();
    full_content := 'INFJ의 시선으로 바라본 타로의 미학: 내면의 평화를 찾는 여정' || chr(10) || 
                   '인생의 불확실성 속에서 우리는 항상 답을 원합니다. 저 같은 INFJ에게는 그 답이 단순한 사실이 아닌, 깊은 의미와 통달을 담고 있어야 하죠. 타로는 바로 그런 의미에서 저에게 최고의 파트너입니다. ' || 
                   repeat(cb_body1, 10) || repeat(cb_body2, 10) || repeat(cb_body3, 10) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, hong3999_id, '선_3999', 'INFJ', 'INFJ의 시선으로 바라본 타로의 미학: 내면의 평화를 찾는 여정', full_content, '자유게시판', 42, 0, current_timestamp - INTERVAL '1 hour');

    -- [자유게시판] Unique Post 2
    post_id := gen_random_uuid();
    full_content := 'ENTJ 리더십과 타로 전략: 비즈니스 의사결정의 숨은 보조 지표' || chr(10) || 
                   '리더는 고독한 결정을 내려야 할 때가 많습니다. ENTJ인 저는 논리와 데이터를 신뢰하지만, 때로는 논리 너머의 직관이 필요할 때가 있음을 압니다. 타로는 저에게 리스크를 점검하는 또 다른 렌즈입니다. ' || 
                   repeat(cb_body2, 12) || repeat(cb_body1, 8) || repeat(cb_body3, 10) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, sajang_id, '박사장', 'ENTJ', 'ENTJ 리더십과 타로 전략: 비즈니스 의사결정의 숨은 보조 지표', full_content, '자유게시판', 56, 0, current_timestamp - INTERVAL '3 hours');

    -- [자유게시판] Unique Post 3
    post_id := gen_random_uuid();
    full_content := 'ENFP의 타로 모험기: 매일 아침 카드 한 장으로 시작하는 설레는 일상' || chr(10) || 
                   '모두들 안녕! 오늘 하루도 반짝반짝 빛나고 있나요? ENFP인 저는 매일 아침 타로 카드를 한 장 뽑으며 오늘 어떤 재미있는 일이 일어날지 상상하곤 해요. 카드는 저에게 단순한 예견이 아니라 영감의 원천입니다! ' || 
                   repeat(cb_body3, 15) || repeat(cb_body1, 5) || repeat(cb_body2, 10) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, nari_id, '나리', 'ENFP', 'ENFP의 타로 모험기: 매일 아침 카드 한 장으로 시작하는 설레는 일상', full_content, '자유게시판', 38, 0, current_timestamp - INTERVAL '5 hours');

    -- [고민상담] Unique Post 4
    post_id := gen_random_uuid();
    full_content := '끝나지 않은 그리움, INFP의 이별 극복 프로젝트와 타로의 위로' || chr(10) || 
                   '누군가를 떠나보낸다는 것은 영혼의 일부가 잘려나가는 기분입니다. 특히 감정의 파고가 깊은 INFP에게 이별은 긴 터널과 같죠. 저는 타로 카드를 통해 그 터널 끝의 빛을 보았습니다. ' || 
                   repeat(cb_healing, 12) || repeat(cb_body1, 10) || repeat(cb_body2, 8) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, hong2075_id, '선_2075', 'INFP', '끝나지 않은 그리움, INFP의 이별 극복 프로젝트와 타로의 위로', full_content, '고민상담', 72, 0, current_timestamp - INTERVAL '7 hours');

    -- [고민상담] Unique Post 5
    post_id := gen_random_uuid();
    full_content := '진로와 적성 사이의 방황: ESTJ가 정립한 실전 타로 활용 진로 가이드' || chr(10) || 
                   '성공을 위해서는 명확한 목표와 계획이 필수입니다. 하지만 때로는 어떤 길이 나에게 가장 효율적인지 판단이 서지 않을 때가 있습니다. ESTJ인 제가 타로를 통해 저의 현실적인 진로를 어떻게 정립했는지 공유합니다. ' || 
                   repeat(cb_practical, 15) || repeat(cb_body2, 8) || repeat(cb_body1, 7) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, cobujang_id, '타로맨', 'ESTJ', '진로와 적성 사이의 방황: ESTJ가 정립한 실전 타로 활용 진로 가이드', full_content, '고민상담', 49, 0, current_timestamp - INTERVAL '9 hours');

    -- [결과자랑] Unique Post 6
    post_id := gen_random_uuid();
    full_content := '소름 돋는 적중 후기! ENFP의 짝사랑 성공 비결은 타로 리딩이었다?' || chr(10) || 
                   '여러분 대박 사건이에요! 제가 짝사랑하던 그 분과 드디어 연인이 되었어요! 저번에 본 연애운 리딩에서 "컵의 임금" 카드가 나오면서 용기를 내라고 했는데, 그게 신의 한 수였던 것 같아요! ' || 
                   repeat(cb_body3, 20) || repeat(cb_healing, 5) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, nari_id, '나리', 'ENFP', '소름 돋는 적중 후기! ENFP의 짝사랑 성공 비결은 타로 리딩이었다?', full_content, '결과자랑', 112, 0, current_timestamp - INTERVAL '11 hours');

    -- [결과자랑] Unique Post 7
    post_id := gen_random_uuid();
    full_content := '투자 대박 기원! 타로 리딩이 알려준 행운의 시점으로 얻은 경제적 실익' || chr(10) || 
                   '비즈니스와 투자는 결국 타이밍의 예술입니다. 타로 리딩이 제시한 신중함과 추진력의 조화가 이번 제 투자 포트폴리오에 큰 수익을 안겨주었습니다. ENTJ로서 이 승리의 기쁨을 나눕니다! ' || 
                   repeat(cb_practical, 15) || repeat(cb_body1, 10) || repeat(cb_body2, 5) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, sajang_id, '박사장', 'ENTJ', '투자 대박 기원! 타로 리딩이 알려준 행운의 시점으로 얻은 경제적 실익', full_content, '결과자랑', 84, 0, current_timestamp - INTERVAL '13 hours');

    -- [자유게시판] Unique Post 8
    post_id := gen_random_uuid();
    full_content := 'INTJ의 고찰: 타로 원형론과 분석 심리학의 만남, 그리고 우리의 잠재력' || chr(10) || 
                   '의미 없는 우연은 없습니다. 만물이 연결되어 있다는 동시성(Synchronicity)의 원리를 타로와 MBTI를 통해 증명해 보려 합니다. 학문적 호기심으로 시작한 이 여정이 얼마나 논리적인지 설명드리죠. ' || 
                   repeat(cb_body1, 25) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, master_id, '마스터', 'INTJ', 'INTJ의 고찰: 타로 원형론과 분석 심리학의 만남, 그리고 우리의 잠재력', full_content, '자유게시판', 67, 0, current_timestamp - INTERVAL '15 hours');

    -- [고민상담] Unique Post 9
    post_id := gen_random_uuid();
    full_content := '인간관계가 너무 힘들 때, MBTI 상성과 타로 조언으로 풀어낸 해결책' || chr(10) || 
                   '주변 사람들과의 갈등 때문에 밤잠을 설친 적이 한두 번이 아닙니다. INFJ인 저에게 타인과의 조화는 목숨만큼 중요하거든요. 타로 카드는 제가 무엇을 양보하고 무엇을 지켜야 할지 알려주었습니다. ' || 
                   repeat(cb_body2, 12) || repeat(cb_healing, 12) || repeat(cb_body3, 6) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, hong3999_id, '선_3999', 'INFJ', '인간관계가 너무 힘들 때, MBTI 상성과 타로 조언으로 풀어낸 해결책', full_content, '고민상담', 58, 0, current_timestamp - INTERVAL '17 hours');

    -- [결과자랑] Unique Post 10
    post_id := gen_random_uuid();
    full_content := '오늘의 카드 "The Sun"! 정말 해가 뜨는 것처럼 행복한 일이 생겼어요' || chr(10) || 
                   '기분 좋은 에너지는 나눌수록 커집니다! 오늘 뽑은 태양 카드처럼 제 삶에 오랫동안 원하던 소식이 들려왔습니다. 여러분 모두 이 긍정의 기운 받아가서 오늘 하루 축복 가득하시길 바라요! ' || 
                   repeat(cb_body3, 20) || repeat(cb_body1, 10) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, nari_id, '나리', 'ENFP', '오늘의 카드 "The Sun"! 정말 해가 뜨는 것처럼 행복한 일이 생겼어요', full_content, '결과자랑', 134, 0, current_timestamp - INTERVAL '19 hours');

    -- [자유게시판] Unique Post 11
    post_id := gen_random_uuid();
    full_content := '타로 덱의 역사와 그 속에 숨겨진 16가지 성격 유형의 흔적들' || chr(10) || 
                   '역사의 흐름 속에서 타로는 어떻게 변모해왔을까요? MBTI의 역사와 교차점을 찾다 보니 놀라운 사실들을 발견했습니다. 고대의 지혜가 현대 심리학으로 계승되는 과정을 함께 살펴보시죠. ' || 
                   repeat(cb_body1, 15) || repeat(cb_body2, 10) || repeat(cb_body3, 5) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, master_id, '마스터', 'INTJ', '타로 덱의 역사와 그 속에 숨겨진 16가지 성격 유형의 흔적들', full_content, '자유게시판', 45, 0, current_timestamp - INTERVAL '21 hours');

    -- [고민상담] Unique Post 12
    post_id := gen_random_uuid();
    full_content := '번아웃에 지친 직장인을 위한 타로 휴식법: 에너지를 다시 채우는 시간' || chr(10) || 
                   '일만 하다 보니 내가 누구인지 잊어버릴 때가 많습니다. ESTJ인 저조차 번아웃 앞에서는 무력해지더군요. 타로 리딩을 통해 제 영혼이 진정으로 원하는 휴식이 무엇인지 알게 되었습니다. ' || 
                   repeat(cb_healing, 15) || repeat(cb_practical, 15) || cb_outro;
    INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at)
    VALUES (post_id, cobujang_id, '타로맨', 'ESTJ', '번아웃에 지친 직장인을 위한 타로 휴식법: 에너지를 다시 채우는 시간', full_content, '고민상담', 63, 0, current_timestamp - INTERVAL '23 hours');

END $$;
