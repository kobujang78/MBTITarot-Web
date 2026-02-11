import { useState } from 'react';
import { TarotCard } from '../types';

export const useUIState = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeNotice, setActiveNotice] = useState<'tos' | 'privacy' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewingCard, setViewingCard] = useState<TarotCard | null>(null);
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [spreadError, setSpreadError] = useState<string | null>(null);

  return {
    isAuthModalOpen, setIsAuthModalOpen,
    isShareModalOpen, setIsShareModalOpen,
    activeNotice, setActiveNotice,
    isMenuOpen, setIsMenuOpen,
    viewingCard, setViewingCard,
    activeTooltipId, setActiveTooltipId,
    isRetryModalOpen, setIsRetryModalOpen,
    showSplash, setShowSplash,
    spreadError, setSpreadError
  };
};
