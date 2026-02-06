import { SavedReading, SelectedCard } from "../types";

const STORAGE_KEY = 'mystic_tarot_history';

export const saveReadingToStorage = (
  question: string,
  mbti: string,
  cards: SelectedCard[],
  result: string,
  readingTypeName: string = "운명의 흐름"
): SavedReading => {
  const now = new Date();
  const newReading: SavedReading = {
    id: crypto.randomUUID(),
    timestamp: now.getTime(),
    dateString: now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    readingTypeName,
    question: question || `${readingTypeName} (General)`,
    mbti: mbti || undefined,
    cards,
    result
  };

  const currentHistory = getReadingsFromStorage();
  const updatedHistory = [newReading, ...currentHistory];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

  return newReading;
};

export const getReadingsFromStorage = (): SavedReading[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const deleteReadingFromStorage = (id: string): SavedReading[] => {
  const currentHistory = getReadingsFromStorage();
  const updatedHistory = currentHistory.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};