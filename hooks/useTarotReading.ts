import { useState, useCallback, useMemo, useEffect } from 'react';
import { getTarotReading } from '../services/geminiService';
import { showInterstitialAd } from '../services/admobService';
import { AppStep, SelectedCard, SavedReading } from '../types';
import { saveReadingToStorage } from '../services/storageService';

export const useTarotReading = (
  question: string, 
  selectedCards: SelectedCard[], 
  selectedMbti: string, 
  spreadName: string, 
  nickname: string | undefined,
  setStep: (step: AppStep) => void,
  setHistory: React.Dispatch<React.SetStateAction<SavedReading[]>>
) => {
  const [readingResult, setReadingResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const getReading = useCallback(async () => {
    try { await showInterstitialAd(); } catch (e) { console.error("Ad show failed", e); }
    setStep(AppStep.READING);
    setIsLoading(true);
    try {
      const result = await getTarotReading(question, selectedCards, selectedMbti, spreadName, nickname);
      setReadingResult(result);
      const saved = saveReadingToStorage(question, selectedMbti, selectedCards, result, spreadName);
      setHistory(prev => [saved, ...prev]);
    } catch (error) {
      setReadingResult("죄송합니다. 우주와의 연결이 불안정합니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [question, selectedCards, selectedMbti, spreadName, nickname, setStep, setHistory]);

  const readingSections = useMemo(() => {
    if (!readingResult) return [];
    const rawSections = readingResult.split(/(?=### )/g);
    const parsedSections = rawSections.map(section => {
      const lines = section.trim().split('\n');
      if (lines.length === 0 || !lines[0].startsWith('### ')) return null;
      return { title: lines[0].replace(/^### /, '').trim(), content: lines.slice(1).join('\n').trim() };
    }).filter((s): s is { title: string; content: string } => s !== null);

    if (parsedSections.length > 0) {
      const tocContent = parsedSections.map((s, idx) => `* chapter_link:${idx + 1}:${s.title}`).join('\n');
      return [{ title: "📖 타로풀이 결과 📖", content: `순서입니다.\n\n${tocContent}` }, ...parsedSections];
    }
    return parsedSections;
  }, [readingResult]);

  useEffect(() => { if (readingResult) setCurrentPage(0); }, [readingResult]);

  return { readingResult, setReadingResult, isLoading, setIsLoading, readingSections, currentPage, setCurrentPage, getReading };
};
