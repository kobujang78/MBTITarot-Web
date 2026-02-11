import { useState, useMemo, useCallback } from 'react';
import { SavedReading, SelectedCard, AppStep } from '../types';
import { getReadingsFromStorage, deleteReadingFromStorage } from '../services/storageService';

export const useHistoryManager = (
  setStep: (step: AppStep) => void,
  setQuestion: (q: string) => void,
  setSelectedMbti: (m: string) => void,
  setSelectedCards: (c: SelectedCard[]) => void,
  setReadingResult: (r: string) => void,
  setIsHistoryMode: (m: boolean) => void
) => {
  const [history, setHistory] = useState<SavedReading[]>(getReadingsFromStorage());
  const [historySort, setHistorySort] = useState<'newest' | 'oldest'>('newest');
  const [historySearch, setHistorySearch] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const filteredHistory = useMemo(() => {
    let result = [...history];
    if (historySearch.trim()) {
      const query = historySearch.toLowerCase();
      result = result.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.cards.some(c => c.nameKo.toLowerCase().includes(query)) ||
        (item.mbti && item.mbti.toLowerCase().includes(query))
      );
    }
    result.sort((a, b) => historySort === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    return result;
  }, [history, historySearch, historySort]);

  const loadHistoryItem = useCallback((item: SavedReading) => {
    setQuestion(item.question);
    setSelectedMbti(item.mbti || '');
    setSelectedCards(item.cards);
    setReadingResult(item.result);
    setIsHistoryMode(true);
    setStep(AppStep.READING);
  }, [setStep, setQuestion, setSelectedMbti, setSelectedCards, setReadingResult, setIsHistoryMode]);

  const deleteHistoryItem = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(deleteReadingFromStorage(id));
  }, []);

  return { 
    history, setHistory, historySort, setHistorySort, historySearch, setHistorySearch, 
    expandedHistoryId, setExpandedHistoryId, filteredHistory, loadHistoryItem, deleteHistoryItem 
  };
};
