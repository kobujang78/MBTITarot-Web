import { useState, useCallback, useRef } from 'react';
import { AppStep, SelectedCard, TarotCard, TarotSpread } from '../types';
import { TAROT_SPREADS, ALL_CARDS } from '../constants';
import { deductCrystal, getUserProfile } from '../services/userService';

export const useTarotSession = (currentUser: any, userProfile: any, setUserProfile: any, setIsAuthModalOpen: (open: boolean) => void, triggerFlipSound: () => void) => {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const [question, setQuestion] = useState('');
  const [selectedMbti, setSelectedMbti] = useState<string>('');
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread>(TAROT_SPREADS.TODAY);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [isQuestionFeeDeducted, setIsQuestionFeeDeducted] = useState(false);
  const isProcessingRef = useRef(false);

  const finalizeShuffle = useCallback(() => {
    const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setSelectedCards([]);
    setStep(AppStep.SELECTION);
  }, []);

  const startShuffling = useCallback(() => {
    const isToday = selectedSpread.id === 'TODAY';
    const isNewYear = selectedSpread.id === 'NEW_YEAR';
    const hasSpecificQuestion = question.trim().length > 0;
    const spreadCost = isNewYear ? selectedSpread.cardCount : 0;
    const questionFee = hasSpecificQuestion ? 5 : 0;
    const totalExpectedCost = spreadCost + questionFee;
    const loginRequired = !isToday || hasSpecificQuestion;

    setIsQuestionFeeDeducted(false);

    if (loginRequired) {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
      if (totalExpectedCost > 0 && (!userProfile || userProfile.crystals < totalExpectedCost)) {
        alert(`수정구슬이 부족합니다. (필요: ${totalExpectedCost}개)`);
        return;
      }
    }

    setStep(AppStep.SHUFFLE);
    setTimeout(finalizeShuffle, 3000);
  }, [selectedSpread, question, currentUser, userProfile, setIsAuthModalOpen, finalizeShuffle]);

  const handleCardSelect = useCallback(async (card: TarotCard) => {
    if (isProcessingRef.current || selectedCards.length >= selectedSpread.cardCount) return;
    if (selectedCards.some(c => c.id === card.id)) return;

    const isToday = selectedSpread.id === 'TODAY';
    const isNewYear = selectedSpread.id === 'NEW_YEAR';
    const hasSpecificQuestion = question.trim().length > 0;
    const needsQuestionFee = hasSpecificQuestion && !isQuestionFeeDeducted;
    const currentStepCost = (isNewYear ? 1 : 0) + (needsQuestionFee ? 5 : 0);

    if (!isToday || hasSpecificQuestion) {
      if (!currentUser) {
        setIsAuthModalOpen(true);
        return;
      }
    }

    if (currentStepCost > 0) {
      if (!userProfile || userProfile.crystals < currentStepCost) {
        alert(`수정구슬이 부족합니다. (필요: ${currentStepCost}개)`);
        return;
      }

      isProcessingRef.current = true;
      const freshProfile = await getUserProfile(currentUser.id);
      if (!freshProfile || freshProfile.crystals < currentStepCost) {
        alert(`수정구슬이 부족합니다.`);
        isProcessingRef.current = false;
        if (freshProfile) setUserProfile(freshProfile);
        return;
      }

      const result = await deductCrystal(currentUser.id, currentStepCost);
      if (!result.success) {
        alert(`수정구슬 차감 실패: ${result.message}`);
        isProcessingRef.current = false;
        return;
      }
      if (needsQuestionFee) setIsQuestionFeeDeducted(true);
      isProcessingRef.current = false;
    }

    triggerFlipSound();
    const newSelection: SelectedCard = {
      ...card,
      isReversed: Math.random() < 0.3,
      position: selectedSpread.slots[selectedCards.length].title
    };

    const newSelected = [...selectedCards, newSelection];
    setSelectedCards(newSelected);

    if (newSelected.length === selectedSpread.cardCount) {
      setTimeout(() => setStep(AppStep.REVEAL), 2500);
    }
  }, [selectedCards, selectedSpread, question, isQuestionFeeDeducted, currentUser, userProfile, setIsAuthModalOpen, triggerFlipSound, setUserProfile]);

  const resetApp = useCallback(() => {
    setStep(AppStep.INTRO);
    setQuestion('');
    setSelectedCards([]);
    setDeck([]);
    setIsQuestionFeeDeducted(false);
  }, []);

  return {
    step, setStep, question, setQuestion, selectedMbti, setSelectedMbti,
    selectedSpread, setSelectedSpread, deck, setDeck, selectedCards, setSelectedCards,
    startShuffling, handleCardSelect, resetApp
  };
};
