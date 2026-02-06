import { TarotCard } from "./types";

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: "The Fool", nameKo: "바보 (The Fool)", imageKeyword: "clown", meaningUp: "새로운 시작, 순수함, 모험", meaningRev: "무모함, 어리석음" },
  { id: 1, name: "The Magician", nameKo: "마법사 (The Magician)", imageKeyword: "magic", meaningUp: "창조력, 기술, 의지", meaningRev: "속임수, 재능 낭비" },
  { id: 2, name: "The High Priestess", nameKo: "고위 여사제 (The High Priestess)", imageKeyword: "moon", meaningUp: "직관, 신비, 지혜", meaningRev: "비밀, 억압된 감정" },
  { id: 3, name: "The Empress", nameKo: "여황제 (The Empress)", imageKeyword: "nature", meaningUp: "풍요, 모성애, 자연", meaningRev: "사치, 게으름" },
  { id: 4, name: "The Emperor", nameKo: "황제 (The Emperor)", imageKeyword: "throne", meaningUp: "권위, 구조, 통제", meaningRev: "독재, 미성숙" },
  { id: 5, name: "The Hierophant", nameKo: "교황 (The Hierophant)", imageKeyword: "church", meaningUp: "전통, 신념, 교육", meaningRev: "반항, 독선" },
  { id: 6, name: "The Lovers", nameKo: "연인 (The Lovers)", imageKeyword: "couple", meaningUp: "사랑, 조화, 선택", meaningRev: "불화, 잘못된 선택" },
  { id: 7, name: "The Chariot", nameKo: "전차 (The Chariot)", imageKeyword: "chariot", meaningUp: "승리, 결단력, 행동", meaningRev: "패배, 통제 불능" },
  { id: 8, name: "Strength", nameKo: "힘 (Strength)", imageKeyword: "lion", meaningUp: "용기, 인내, 동정심", meaningRev: "나약함, 자신감 부족" },
  { id: 9, name: "The Hermit", nameKo: "은둔자 (The Hermit)", imageKeyword: "lantern", meaningUp: "성찰, 고독, 인도", meaningRev: "고립, 외로움" },
  { id: 10, name: "Wheel of Fortune", nameKo: "운명의 수레바퀴 (Wheel of Fortune)", imageKeyword: "wheel", meaningUp: "운명, 변화, 행운", meaningRev: "불운, 저항" },
  { id: 11, name: "Justice", nameKo: "정의 (Justice)", imageKeyword: "scale", meaningUp: "공정, 진실, 법", meaningRev: "불공정, 편견" },
  { id: 12, name: "The Hanged Man", nameKo: "매달린 사람 (The Hanged Man)", imageKeyword: "tree", meaningUp: "희생, 새로운 관점", meaningRev: "무의미한 희생, 지체" },
  { id: 13, name: "Death", nameKo: "죽음 (Death)", imageKeyword: "skull", meaningUp: "끝, 변화, 재탄생", meaningRev: "변화에 대한 저항" },
  { id: 14, name: "Temperance", nameKo: "절제 (Temperance)", imageKeyword: "water", meaningUp: "균형, 조화, 인내", meaningRev: "불균형, 과도함" },
  { id: 15, name: "The Devil", nameKo: "악마 (The Devil)", imageKeyword: "devil", meaningUp: "중독, 속박, 물질주의", meaningRev: "해방, 자유" },
  { id: 16, name: "The Tower", nameKo: "탑 (The Tower)", imageKeyword: "tower", meaningUp: "갑작스런 변화, 붕괴", meaningRev: "재난 모면, 두려움" },
  { id: 17, name: "The Star", nameKo: "별 (The Star)", imageKeyword: "star", meaningUp: "희망, 영감, 평온", meaningRev: "절망, 낙담" },
  { id: 18, name: "The Moon", nameKo: "달 (The Moon)", imageKeyword: "night", meaningUp: "환상, 불안, 잠재의식", meaningRev: "혼란 해소, 진실 발견" },
  { id: 19, name: "The Sun", nameKo: "태양 (The Sun)", imageKeyword: "sun", meaningUp: "성공, 기쁨, 활력", meaningRev: "일시적 우울, 성공 지연" },
  { id: 20, name: "Judgement", nameKo: "심판 (Judgement)", imageKeyword: "angel", meaningUp: "부활, 각성, 용서", meaningRev: "후회, 자기 비판" },
  { id: 21, name: "The World", nameKo: "세계 (The World)", imageKeyword: "earth", meaningUp: "완성, 성취, 여행", meaningRev: "미완성, 정체" },
];

export const MINOR_ARCANA: TarotCard[] = [
  // Wands (지팡이 - 열정, 행동)
  { id: 22, name: "Ace of Wands", nameKo: "완드 에이스", imageKeyword: "wands", meaningUp: "새로운 열정, 창조적인 시작", meaningRev: "지연된 계획, 의욕 상실" },
  { id: 23, name: "Two of Wands", nameKo: "완드 2", imageKeyword: "wands", meaningUp: "미래 계획, 결정, 발견", meaningRev: "두려움, 계획의 실패" },
  { id: 24, name: "Three of Wands", nameKo: "완드 3", imageKeyword: "wands", meaningUp: "확장, 협력, 여행", meaningRev: "장애물, 실망" },
  { id: 25, name: "Four of Wands", nameKo: "완드 4", imageKeyword: "wands", meaningUp: "축하, 귀환, 안정", meaningRev: "불안정, 갈등" },
  { id: 26, name: "Five of Wands", nameKo: "완드 5", imageKeyword: "wands", meaningUp: "경쟁, 갈등, 도전", meaningRev: "갈등 해소, 합의" },
  { id: 27, name: "Six of Wands", nameKo: "완드 6", imageKeyword: "wands", meaningUp: "승리, 인정, 자부심", meaningRev: "실패, 불명예" },
  { id: 28, name: "Seven of Wands", nameKo: "완드 7", imageKeyword: "wands", meaningUp: "방어, 인내, 용기", meaningRev: "포기, 압도당함" },
  { id: 29, name: "Eight of Wands", nameKo: "완드 8", imageKeyword: "wands", meaningUp: "신속한 행동, 소식", meaningRev: "지연, 혼란" },
  { id: 30, name: "Nine of Wands", nameKo: "완드 9", imageKeyword: "wands", meaningUp: "끈기, 마지막 방어", meaningRev: "지침, 포기" },
  { id: 31, name: "Ten of Wands", nameKo: "완드 10", imageKeyword: "wands", meaningUp: "부담, 책임감, 과로", meaningRev: "짐을 내려놓음, 해방" },
  { id: 32, name: "Page of Wands", nameKo: "완드 시종", imageKeyword: "wands", meaningUp: "새로운 소식, 호기심", meaningRev: "나쁜 소식, 미성숙" },
  { id: 33, name: "Knight of Wands", nameKo: "완드 기사", imageKeyword: "wands", meaningUp: "행동력, 모험, 열정", meaningRev: "충동적, 무모함" },
  { id: 34, name: "Queen of Wands", nameKo: "완드 여왕", imageKeyword: "wands", meaningUp: "자신감, 매력, 활력", meaningRev: "질투, 변덕" },
  { id: 35, name: "King of Wands", nameKo: "완드 왕", imageKeyword: "wands", meaningUp: "리더십, 비전, 명예", meaningRev: "독단적, 충동적" },

  // Cups (성배 - 감정, 관계)
  { id: 36, name: "Ace of Cups", nameKo: "컵 에이스", imageKeyword: "cups", meaningUp: "새로운 사랑, 감정의 시작", meaningRev: "감정의 메마름, 실망" },
  { id: 37, name: "Two of Cups", nameKo: "컵 2", imageKeyword: "cups", meaningUp: "결합, 파트너십, 조화", meaningRev: "불화, 이별" },
  { id: 38, name: "Three of Cups", nameKo: "컵 3", imageKeyword: "cups", meaningUp: "축배, 우정, 공동체", meaningRev: "과도함, 소외" },
  { id: 39, name: "Four of Cups", nameKo: "컵 4", imageKeyword: "cups", meaningUp: "무관심, 권태, 성찰", meaningRev: "새로운 기회, 깨달음" },
  { id: 40, name: "Five of Cups", nameKo: "컵 5", imageKeyword: "cups", meaningUp: "상실, 후회, 슬픔", meaningRev: "회복, 수용" },
  { id: 41, name: "Six of Cups", nameKo: "컵 6", imageKeyword: "cups", meaningUp: "추억, 순수함, 과거", meaningRev: "미래 지향, 성장" },
  { id: 42, name: "Seven of Cups", nameKo: "컵 7", imageKeyword: "cups", meaningUp: "환상, 선택의 혼란", meaningRev: "현실 직시, 명확한 선택" },
  { id: 43, name: "Eight of Cups", nameKo: "컵 8", imageKeyword: "cups", meaningUp: "떠남, 새로운 길 모색", meaningRev: "머무름, 두려움" },
  { id: 44, name: "Nine of Cups", nameKo: "컵 9", imageKeyword: "cups", meaningUp: "만족, 소원 성취", meaningRev: "불만족, 탐욕" },
  { id: 45, name: "Ten of Cups", nameKo: "컵 10", imageKeyword: "cups", meaningUp: "행복한 가정, 완성", meaningRev: "가정 불화, 깨진 꿈" },
  { id: 46, name: "Page of Cups", nameKo: "컵 시종", imageKeyword: "cups", meaningUp: "감수성, 새로운 메시지", meaningRev: "감정적 미성숙, 변덕" },
  { id: 47, name: "Knight of Cups", nameKo: "컵 기사", imageKeyword: "cups", meaningUp: "로맨스, 제안, 이상주의", meaningRev: "실망스러운, 기분파" },
  { id: 48, name: "Queen of Cups", nameKo: "컵 여왕", imageKeyword: "cups", meaningUp: "공감, 직관, 자애로움", meaningRev: "감정 과잉, 의존적" },
  { id: 49, name: "King of Cups", nameKo: "컵 왕", imageKeyword: "cups", meaningUp: "감정 조절, 외교적", meaningRev: "감정 조작, 냉담함" },

  // Swords (검 - 이성, 사고)
  { id: 50, name: "Ace of Swords", nameKo: "검 에이스", imageKeyword: "swords", meaningUp: "명확한 사고, 진실, 승리", meaningRev: "혼란, 오해" },
  { id: 51, name: "Two of Swords", nameKo: "검 2", imageKeyword: "swords", meaningUp: "균형, 선택의 기로", meaningRev: "우유부단, 혼란" },
  { id: 52, name: "Three of Swords", nameKo: "검 3", imageKeyword: "swords", meaningUp: "상처, 슬픔, 이별", meaningRev: "회복, 용서" },
  { id: 53, name: "Four of Swords", nameKo: "검 4", imageKeyword: "swords", meaningUp: "휴식, 회복, 명상", meaningRev: "활동 재개, 소진" },
  { id: 54, name: "Five of Swords", nameKo: "검 5", imageKeyword: "swords", meaningUp: "패배, 갈등, 손실", meaningRev: "화해, 갈등 해결" },
  { id: 55, name: "Six of Swords", nameKo: "검 6", imageKeyword: "swords", meaningUp: "이동, 회복, 변화", meaningRev: "정체, 문제의 지속" },
  { id: 56, name: "Seven of Swords", nameKo: "검 7", imageKeyword: "swords", meaningUp: "전략, 속임수, 회피", meaningRev: "자백, 진실" },
  { id: 57, name: "Eight of Swords", nameKo: "검 8", imageKeyword: "swords", meaningUp: "구속, 두려움, 제한", meaningRev: "해방, 새로운 관점" },
  { id: 58, name: "Nine of Swords", nameKo: "검 9", imageKeyword: "swords", meaningUp: "불안, 악몽, 걱정", meaningRev: "희망, 걱정 해소" },
  { id: 59, name: "Ten of Swords", nameKo: "검 10", imageKeyword: "swords", meaningUp: "끝, 배신, 고통", meaningRev: "회복의 시작, 생존" },
  { id: 60, name: "Page of Swords", nameKo: "검 시종", imageKeyword: "swords", meaningUp: "호기심, 경계, 정보", meaningRev: "속임수, 말실수" },
  { id: 61, name: "Knight of Swords", nameKo: "검 기사", imageKeyword: "swords", meaningUp: "야망, 신속함, 직설적", meaningRev: "무모함, 공격적" },
  { id: 62, name: "Queen of Swords", nameKo: "검 여왕", imageKeyword: "swords", meaningUp: "독립적, 명확함, 냉철함", meaningRev: "비판적, 잔인함" },
  { id: 63, name: "King of Swords", nameKo: "검 왕", imageKeyword: "swords", meaningUp: "지적, 권위, 공정함", meaningRev: "독재, 잔혹함" },

  // Pentacles (동전 - 물질, 현실)
  { id: 64, name: "Ace of Pentacles", nameKo: "펜타클 에이스", imageKeyword: "pentacles", meaningUp: "새로운 기회, 번영", meaningRev: "기회 상실, 부족" },
  { id: 65, name: "Two of Pentacles", nameKo: "펜타클 2", imageKeyword: "pentacles", meaningUp: "균형, 적응, 유연성", meaningRev: "불균형, 과도한 부채" },
  { id: 66, name: "Three of Pentacles", nameKo: "펜타클 3", imageKeyword: "pentacles", meaningUp: "팀워크, 기술, 협력", meaningRev: "불화, 기술 부족" },
  { id: 67, name: "Four of Pentacles", nameKo: "펜타클 4", imageKeyword: "pentacles", meaningUp: "소유, 안정, 인색함", meaningRev: "낭비, 놓아줌" },
  { id: 68, name: "Five of Pentacles", nameKo: "펜타클 5", imageKeyword: "pentacles", meaningUp: "빈곤, 소외, 어려움", meaningRev: "회복, 도움" },
  { id: 69, name: "Six of Pentacles", nameKo: "펜타클 6", imageKeyword: "pentacles", meaningUp: "나눔, 자선, 관대함", meaningRev: "이기심, 빚" },
  { id: 70, name: "Seven of Pentacles", nameKo: "펜타클 7", imageKeyword: "pentacles", meaningUp: "인내, 투자, 수확", meaningRev: "조급함, 낭비" },
  { id: 71, name: "Eight of Pentacles", nameKo: "펜타클 8", imageKeyword: "pentacles", meaningUp: "장인정신, 노력, 숙련", meaningRev: "게으름, 저품질" },
  { id: 72, name: "Nine of Pentacles", nameKo: "펜타클 9", imageKeyword: "pentacles", meaningUp: "풍요, 독립, 사치", meaningRev: "의존, 재정적 손실" },
  { id: 73, name: "Ten of Pentacles", nameKo: "펜타클 10", imageKeyword: "pentacles", meaningUp: "유산, 가족, 부", meaningRev: "가정 불화, 손실" },
  { id: 74, name: "Page of Pentacles", nameKo: "펜타클 시종", imageKeyword: "pentacles", meaningUp: "학습, 새로운 시작", meaningRev: "집중력 부족, 낭비" },
  { id: 75, name: "Knight of Pentacles", nameKo: "펜타클 기사", imageKeyword: "pentacles", meaningUp: "성실, 신뢰, 효율", meaningRev: "게으름, 정체" },
  { id: 76, name: "Queen of Pentacles", nameKo: "펜타클 여왕", imageKeyword: "pentacles", meaningUp: "현실적, 양육, 풍요", meaningRev: "이기적, 질투" },
  { id: 77, name: "King of Pentacles", nameKo: "펜타클 왕", imageKeyword: "pentacles", meaningUp: "성공, 부, 안정", meaningRev: "탐욕, 고집" },
];

export const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// Using local card back image
export const CARD_BACK_IMAGE_URL = "/image/78.jpg";

// Dark Mystical Silver/Nebula Background
export const APP_BACKGROUND_IMAGE_URL = "/background.jpg";

export const MBTI_TYPES = [
  '공통',
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

export const TAROT_SPREADS = {
  TODAY: {
    id: 'TODAY',
    name: '오늘운세',
    description: '오늘 하루의 전체적인 운의 흐름과 조언을 확인합니다.',
    cardCount: 1,
    slots: [{ title: '오늘의 흐름', hint: '오늘 당신을 이끌어줄 핵심 기운' }]
  },
  LOTTO: {
    id: 'LOTTO',
    name: '로또운',
    description: '오늘의 횡재수와 행운의 흐름, 당첨운을 확인합니다.',
    cardCount: 1,
    slots: [
      { title: '오늘의 횡재수', hint: '당신에게 깃든 뜻밖의 행운 농도' }
    ]
  },
  NEW_YEAR: {
    id: 'NEW_YEAR',
    name: '신년운세',
    description: '다가오는 새해의 전체적인 운의 흐름과 핵심 키워드를 확인합니다.',
    cardCount: 5,
    slots: [
      { title: '신년 총운', hint: '내년 한 해를 관통하는 핵심 기운' },
      { title: '재물운', hint: '자산 증식과 경제적 흐름' },
      { title: '애정운', hint: '인연과 관계의 깊이' },
      { title: '직업/성취', hint: '커리어와 목표 달성 가능성' },
      { title: '건강/조언', hint: '에너지 관리와 조언' }
    ]
  },
  SOLO_ESCAPE: {
    id: 'SOLO_ESCAPE',
    name: '솔로탈출',
    description: '새로운 인연이 나타날 시기와 당신의 매력 포인트를 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '나의 매력', hint: '새로운 인연을 끌어당길 나의 강점' },
      { title: '연애 기운', hint: '새로운 사람이 나타날 가능성과 시기' },
      { title: '탈출 전략', hint: '솔로 탈출을 위해 해야 할 행동' }
    ]
  },
  ROMANCE: {
    id: 'ROMANCE',
    name: '연애운',
    description: '현재의 애정 전선과 상대방과의 관계 발전 가능성을 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '나의 마음', hint: '당신이 느끼는 본질적인 감정' },
      { title: '상대의 마음', hint: '상대방이 당신을 보는 시선' },
      { title: '관계 전망', hint: '두 사람을 기다리는 미래' }
    ]
  },
  REUNION: {
    id: 'REUNION',
    name: '재회운',
    description: '과거 인연과의 재회 가능성과 현재의 감정 상태를 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '상대의 속마음', hint: '그 사람이 현재 당신을 생각하는 방식' },
      { title: '재회 가능성', hint: '다시 연결될 수 있는 운의 흐름' },
      { title: '나를 위한 조언', hint: '이 인연에 대해 가져야 할 마음가짐' }
    ]
  },
  INVESTMENT: {
    id: 'INVESTMENT',
    name: '투자운',
    description: '전반적인 재물 흐름과 투자의 원칙을 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '재물운 흐름', hint: '현재 당신의 금전적 기운' },
      { title: '투자 성향', hint: '지금 당신에게 맞는 투자 방식' },
      { title: '수익 전망', hint: '앞으로의 자산 증식 가능성' }
    ]
  },
  STOCKS: {
    id: 'STOCKS',
    name: '주식운',
    description: '주식 투자에 대한 판단과 시장의 기운을 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '매수/매도 타이밍', hint: '지금 들어가야 할지 기다려야 할지' },
      { title: '종목 운', hint: '관심 있는 분야의 성공 가능성' },
      { title: '최종 조언', hint: '잃지 않는 투자를 위한 지혜' }
    ]
  },
  REAL_ESTATE: {
    id: 'REAL_ESTATE',
    name: '부동산',
    description: '집, 땅 등 부동산 거래와 주거 운세를 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '매매/임대운', hint: '계약이 원활하게 진행될 가능성' },
      { title: '입지 운', hint: '해당 장소가 당신과 맞는지 여부' },
      { title: '자산 가치', hint: '미래의 가치 상승 가능성' }
    ]
  },
  JOB: {
    id: 'JOB',
    name: '취업운',
    description: '구직 중인 분들을 위한 합격운과 직무 적성을 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '합격 가능성', hint: '원하는 곳에 들어갈 수 있는 기운' },
      { title: '면접/실무운', hint: '실전 실력을 발휘할 수 있는 운' },
      { title: '첫 직장 환경', hint: '입사 후 적응도와 분위기' }
    ]
  },
  BUSINESS: {
    id: 'BUSINESS',
    name: '사업운',
    description: '창업, 운영 중인 사업의 번창 여부와 흐름을 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '사업 흐름', hint: '현재 비즈니스의 건강 상태' },
      { title: '금전/거래처', hint: '자금 융통과 협력사와의 관계' },
      { title: '성장 잠재력', hint: '장기적인 성공 가능성' }
    ]
  },
  RELATIONSHIP: {
    id: 'RELATIONSHIP',
    name: '대인관계',
    description: '주변 사람들과의 관계 흐름과 그들의 속마음을 확인합니다.',
    cardCount: 3,
    slots: [
      { title: '나의 입장', hint: '현재 내가 이 관계에서 느끼는 본질적인 감정' },
      { title: '상대의 마음', hint: '상대방이 나를 바라보는 진짜 생각' },
      { title: '관계의 미래', hint: '앞으로의 관계 변화와 조화를 위한 조언' }
    ]
  }
};
