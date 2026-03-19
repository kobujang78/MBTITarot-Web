
const CATEGORIES = ['자유게시판', '고민상담', '결과자랑'];
const USERS = [
    { nickname: '달빛술사', mbti: 'INFJ' },
    { nickname: '별헤는밤', mbti: 'INFP' },
    { nickname: '논리의왕', mbti: 'INTP' },
    { nickname: '대담한장군', mbti: 'ENTJ' },
    { nickname: '행복전도사', mbti: 'ENFP' },
    { nickname: '신중한목수', mbti: 'ISTJ' },
    { nickname: '꿈꾸는고양이', mbti: 'ISFP' },
    { nickname: '열정맨', mbti: 'ESTP' },
    { nickname: '체계적인비서', mbti: 'ISFJ' },
    { nickname: '아이디어뱅크', mbti: 'ENTP' },
    { nickname: '리더십끝판왕', mbti: 'ENFJ' },
    { nickname: '팩트폭격기', mbti: 'ESTJ' }
];

const TOPICS = {
    '자유게시판': [
        '오늘 날씨가 너무 좋아서 타로 한 장 뽑아봤어요',
        'MBTI 성격 유형에 따른 방 정리 스타일',
        '커피 한 잔 하며 나누는 소소한 일상 이야기',
        'MBTI 궁합, 정말 믿어도 될까요?',
        '나만 알고 싶은 힐링 장소 추천',
        '오늘의 기분을 타로 카드로 표현한다면?',
        '작은 습관이 인생을 바꾼다는 말에 공감하시나요?',
        '책 한 권의 여유, 어떤 책을 읽고 계신가요?',
        '당신의 MBTI는 어떤 색깔인가요?',
        '일상 속 작은 행복을 찾는 방법들',
        '주말 계획 세우기, 여러분은 계획형인가요?',
        '새벽 감성에 쓰는 짧은 일기',
        '최근에 본 영화 중 인생 영화가 있다면?',
        '타로 카드 그림체가 너무 예뻐서 수집하고 싶어요',
        'MBTI 과몰입러의 하루 일과'
    ],
    '고민상담': [
        '연애 고민, 회피형 남자친구 어떻게 해야 할까요?',
        '진로 결정의 갈림길에서 타로의 조언을 구합니다',
        '인간관계에서의 피로감, 어떻게 극복하시나요?',
        '취업 준비 중인데 자꾸 불안함이 밀려오네요',
        '친한 친구와의 서운한 감정, 먼저 말해야 할까요?',
        '번아웃이 온 것 같아요. 쉬는 방법도 모르겠네요',
        '결정 장애가 심한데, 선택을 돕는 팁이 있을까요?',
        '꿈과 현실 사이에서의 갈등, 여러분의 생각은?',
        '새로운 도전을 앞두고 두려움이 앞서요',
        '자꾸 남과 비교하게 되는 나, 어떻게 사랑해줄까요?',
        '가족과의 소통 문제로 마음이 무겁습니다',
        '혼자 있는 시간이 좋으면서도 외로울 때',
        '상사의 잔소리가 너무 심해요. 퇴사 각인가요?',
        '짝사랑을 포기해야 할 시점을 모르겠어요',
        '내 안의 완벽주의 때문에 시작을 못 하겠어요'
    ],
    '결과자랑': [
        '오늘 로또운 타로 봤는데 대박 징조가?!',
        '연애운 결과가 너무 잘 맞아서 소름 돋았어요',
        '신년운세 핵심 키워드가 제 상황이랑 딱 맞네요',
        '타로 광장에서 뽑은 카드, 오늘 제 하루랑 똑같아요',
        '취업운 합격 기운 가득한 카드 자랑합니다',
        '최근 타로 기록 보니까 소름 돋는 평행이론',
        'MBTI 성향이랑 타로 해석이 너무 찰떡궁합',
        '재물운 카드 기운 받아가세요! 넉넉해지는 느낌',
        '오늘의 행운 요소가 실제로 일어났어요!',
        '타로 리딩 내용이 너무 따뜻해서 힐링됐어요',
        '별점 5점 만점에 10점 주고 싶은 리딩 결과',
        '인생의 나침반 같은 타로 결과 공유합니다',
        '매일 아침 타로 한 장으로 활기차게 시작해요',
        '동기부여 팍팍 되는 타로 메시지! 공유각',
        '타로 결과 보고 실천했더니 좋은 일이 생겼네요'
    ]
};

const getRealisticContent = (category, title, user) => {
    const baseContent = `안녕하세요! ${user.nickname}(${user.mbti})입니다.\\n오늘은 ${title}에 대해 이야기를 나누고 싶어서 글을 남겨봐요.\\n\\n`;
    const sections = [
        "평소에 저는 고민이 많을 때마다 이곳에 들러서 타로를 한 장씩 뽑아보곤 하는데요.\\n카드가 들려주는 조언들이 가끔씩은 정말 놀랄 정도로 정확해서 소름 돋을 때가 많아요.",
        "특히 오늘 아침에는 뭔가 기분이 묘해서 질문을 구체적으로 던져봤거든요.\\n그런데 결과가 너무 따뜻하고 긍정적으로 나와서 하루 종일 기분이 좋네요.",
        "여러분은 보통 어떤 질문을 가장 많이 하시나요? 저는 주로 대인관계나 감정적인 소모에 대해 묻는 편이에요.\\n아무래도 성격상 남의 눈치를 많이 보게 되는 경향이 있어서 그런 것 같아요.",
        "타로 카드의 상징들을 하나하나 뜯어보면 참 오묘한 매력이 있는 것 같아요.\\n단순한 그림인 것 같아도 그 안에 담긴 이야기가 제 상황과 연결될 때의 그 희열이란!",
        "가끔은 결과가 좋지 않게 나올 때도 있지만, 그럴 때는 오히려 조심하라는 신호로 받아들이고\\n하루의 태도를 점검해보는 계기로 삼으니까 훨씬 마음이 편하더라고요.",
        "MBTI 타로라 그런지 제 성향을 반영한 해석들이 정말 와닿아요.\\n일반 타로와는 확실히 다른 차별화된 깊이가 느껴진달까요?",
        "댓글로 여러분의 오늘 운세나 고민거리도 들려주세요.\\n서로 응원하고 소통하면서 따뜻한 커뮤니티 공간을 만들어갔으면 좋겠습니다.",
        "오늘 하루도 모두 수고 많으셨고, 내일은 오늘보다 더 빛나는 하루가 되시길 빌게요.\\n행운 가득한 카드 한 장씩 마음에 품고 기분 좋게 잠드셨으면 합니다.",
        "다음에 또 재미있는 이야기나 고민이 생기면 글 쓰러 올게요.\\n읽어주셔서 정말 감사합니다! 건강 유의하시고 늘 행복하세요."
    ];
    
    let full = baseContent;
    sections.forEach(s => {
        full += s + "\\n\\n";
    });
    
    full += Array(5).fill("이곳은 참 따뜻한 공간인 것 같아서 자주 들르게 되네요. 모두 화이팅입니다!").join("\\n");
    
    return full;
};

let sql = ``;

const postsList = [];

for (const category of CATEGORIES) {
    const topics = TOPICS[category];
    for (let i = 0; i < 15; i++) {
        const topicIdx = i % topics.length;
        const user = USERS[Math.floor(Math.random() * USERS.length)];
        const title = topics[topicIdx];
        const content = getRealisticContent(category, title, user);
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        const createdAt = date.toISOString();
        const likes = Math.floor(Math.random() * 50);
        
        sql += `INSERT INTO posts (id, author_id, author_nickname, author_mbti, title, content, category, likes, comment_count, created_at) VALUES (gen_random_uuid(), gen_random_uuid(), '${user.nickname}', '${user.mbti}', '${title.replace(/'/g, "''")}', '${content.replace(/'/g, "''")}', '${category}', ${likes}, 2, '${createdAt}') RETURNING id;\n`;
    }
}

console.log(sql);
