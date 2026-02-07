import React from 'react';
import { TarotCard, SelectedCard } from '../types';
import { CARD_BACK_IMAGE_URL } from '../constants';

interface CardProps {
  card?: TarotCard;
  isRevealed: boolean;
  onClick?: () => void;
  className?: string;
  isReversed?: boolean; // For display after selection
  label?: string; // e.g., "Past", "Present"
}

const Card: React.FC<CardProps> = React.memo(({ card, isRevealed, onClick, className = '', isReversed = false, label }) => {
  // Default dimensions if not overridden by className
  const defaultDims = "w-32 h-52 sm:w-40 sm:h-64";

  return (
    <div
      className="group flex flex-col items-center gap-3 cursor-pointer select-none"
      onClick={onClick}
    >
      {/* Visual Card Box */}
      <div className={`relative perspective-[1000px] ${defaultDims} ${className}`}>
        {label && (
          <div className="absolute -top-8 left-0 right-0 text-center text-slate-300 font-serif text-sm tracking-widest uppercase opacity-80 font-bold z-10">
            {label}
          </div>
        )}

        <div className={`w-full h-full duration-700 transition-all preserve-3d card-preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
          {/* Card Back */}
          <div
            className="absolute inset-0 backface-hidden card-backface-hidden rounded-xl shadow-xl overflow-hidden border border-slate-600"
          >
            <div className="w-full h-full bg-slate-800 relative">
              <img
                src={CARD_BACK_IMAGE_URL}
                alt="Card Back"
                className="w-full h-full object-fill opacity-100 filter contrast-125"
              />
              <div className="absolute inset-0 flex items-center justify-center border-4 border-double border-slate-400/30 m-2 rounded-lg bg-black/20 backdrop-blur-[1px]">
                <span className="text-3xl text-slate-400 drop-shadow-md">✦</span>
              </div>
            </div>
          </div>

          {/* Card Front */}
          <div
            className="absolute inset-0 backface-hidden card-backface-hidden rotate-y-180 rounded-xl shadow-[0_4px_20px_rgba(226,232,240,0.1)] overflow-hidden bg-slate-900 border border-slate-500/50"
          >
            {card && (
              <div className={`w-full h-full relative ${isReversed ? 'rotate-180' : ''}`}>
                <img
                  src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                  alt={card.name}
                  className="w-full h-full object-fill opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text Below Card Box */}
      {isRevealed && card && (
        <div className="text-center z-10 animate-fadeIn w-full px-1">
          <h3 className="text-slate-200 font-serif text-[10px] sm:text-xs font-bold tracking-wider truncate">
            {card.nameKo.split('(')[0].trim()}
          </h3>
          <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 italic truncate opacity-70">{card.name}</p>
        </div>
      )}
    </div>
  );
});

export default Card;