import fs from 'fs';
import crypto from 'crypto';

const supabaseUrl = "https://hjgiwpvhvhpdypzosmft.supabase.co";
const supabaseAnonKey = "sb_publishable_4F2z1AU2SGGrAJPYEls6yg_LbBJ-Iw-";

const users = [
  { id: "d99a03c8-bb80-414c-b707-e9ea31922484", nickname: "나리", mbti: "ENFP" },
  { id: "53072dce-c834-4766-9df5-90b2c8aa7055", nickname: "사장", mbti: "ENTJ" },
  { id: "853f14e7-8711-4480-ac5d-df335c1302f8", nickname: "홍은선_3999", mbti: "INFJ" },
  { id: "fcfbcec3-4cc2-4826-b844-a45d67ce0683", nickname: "홍은선_2075", mbti: "INFP" },
  { id: "074ac781-e0fe-4a30-98bd-d519ad4571d1", nickname: "마스터", mbti: "INTJ" },
  { id: "d8b76ff7-4665-4d13-9cf6-fdc3dee0751b", nickname: "코부장", mbti: "ESTJ" }
];

const categories = ["공지사항", "자유게시판", "고민상담", "결과자랑"];

const postsPerCategory = 12;

const posts = [];
const comments = [];

const getRandomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date.toISOString();
};

const contents = {
  "공지사항": [
    "MBTI 타로 서비스 정식 오픈 안내",
    "이용 약관 및 개인정보 처리방침 개정 안내",
    "커뮤니티 이용 가이드 및 수칙 안내",
    "서버 점검 및 시스템 최적화 완료 보고"
  ],
  "자유게시판": [
    "오늘의 타로 결과가 너무 신기해요!",
    "다들 MBTI랑 타로랑 잘 맞나요?",
    "새로운 타로 덱 추천해주세요~",
    "타로 공부 시작해보고 싶은데 어디서부터 해야 할까요?"
  ],
  "고민상담": [
    "요즘 인간관계 때문에 너무 힘들어요...",
    "이직 고민 중인데 타로가 도움이 될까요?",
    "제 성향(MBTI)이랑 잘 맞는 직업이 뭘까요?",
    "연애운 좀 봐주실 분 계신가요?"
  ],
  "결과자랑": [
    "오늘 뽑은 운명의 수레바퀴 카드!",
    "드디어 원하던 결과가 나왔어요!",
    "제 MBTI 분석 결과인데 찰떡이네요",
    "타로 카드가 너무 예뻐서 공유합니다"
  ]
};

for (const category of categories) {
  for (let i = 0; i < postsPerCategory; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const postId = crypto.randomUUID();
    const createdAt = getRandomDate(90);
    
    const post = {
      id: postId,
      category,
      title: contents[category][i % contents[category].length] + " (" + (i + 1) + ")",
      content: contents[category][i % contents[category].length] + "에 대한 상세 내용입니다. 이 게시물은 사용자 경험과 커뮤니티 활성화를 위해 생성되었습니다. " + " ".repeat(100),
      author_id: user.id,
      author_nickname: user.nickname,
      author_mbti: user.mbti,
      likes: Math.floor(Math.random() * 50),
      comment_count: 2,
      created_at: createdAt
    };
    
    posts.push(post);
    
    for (let j = 0; j < 2; j++) {
      const commenter = users[Math.floor(Math.random() * users.length)];
      comments.push({
        id: crypto.randomUUID(),
        post_id: postId,
        author_id: commenter.id,
        author_nickname: commenter.nickname,
        content: "정말 공감되네요! (댓글 " + (j + 1) + ")",
        created_at: new Date(new Date(createdAt).getTime() + 3600000).toISOString()
      });
    }
  }
}

fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2));
