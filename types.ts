export interface TarotCard {
  id: number;
  name: string;
  nameKo: string; // Korean name
  imageKeyword: string; // For picsum or styling
  meaningUp: string;
  meaningRev: string;
}

export interface SelectedCard extends TarotCard {
  isReversed: boolean;
  position: string; // Dynamic position label
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  slots: { title: string; hint: string }[];
}

export enum ReadingType {
  TODAY = 'TODAY',
  WEALTH = 'WEALTH',
  ROMANCE = 'ROMANCE',
  GENERAL = 'GENERAL',
}

export enum AppStep {
  INTRO = 'INTRO',
  SHUFFLE = 'SHUFFLE',
  SELECTION = 'SELECTION',
  REVEAL = 'REVEAL',
  READING = 'READING',
  HISTORY = 'HISTORY',
  COMMUNITY = 'COMMUNITY',
  MYPAGE = 'MYPAGE',
  MBTI_ABOUT = 'MBTI_ABOUT',
  TAROT_ABOUT = 'TAROT_ABOUT',
  SQUARE = 'SQUARE',
}

export interface ReadingResponse {
  interpretation: string;
}

export interface SavedReading {
  id: string;
  timestamp: number;
  dateString: string;
  readingTypeName: string; // Added reading type name
  question: string;
  mbti?: string; // Added MBTI field
  cards: SelectedCard[];
  result: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  nickname: string;
  mbti?: string;
  crystals: number;

  referredBy?: string;
  lastLoginDate?: string; // YYYY-MM-DD
  createdAt: number;
  totalCount: number;
  marketingConsent?: boolean;
}

export const CRYSTALS_CONFIG = {
  INITIAL: 5,
  REFERRAL_REWARD: 5,
  DAILY_LOGIN: 1,
  COST_PER_READING: 1, // Will apply this later
};

export type PostCategory = '공지사항' | '자유게시판' | '고민상담' | '결과자랑';

export interface Post {
  id: string;
  authorUid: string;
  authorNickname: string;
  authorMbti: string;
  title: string;
  content: string;
  category: PostCategory;
  likes: number;
  commentCount: number;
  createdAt: any; // ISO Date String
  sharedTarot?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorUid: string;
  authorNickname: string;
  content: string;
  createdAt: any; // ISO Date String
}