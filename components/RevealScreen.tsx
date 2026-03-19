import React from 'react';
import { Sparkles } from 'lucide-react';
import { SelectedCard, TarotSpread, TarotCard } from '../types';
import Button from './Button';

interface RevealScreenProps {
  selectedSpread: TarotSpread;
  selectedCards: SelectedCard[];
  setViewingCard: (card: TarotCard) => void;
  getReading: () => void;
}

const RevealScreen: React.FC<RevealScreenProps> = ({ selectedSpread, selectedCards, setViewingCard, getReading }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl animate-fadeIn px-4">
      <div className={`grid ${selectedSpread.cardCount === 1 ? 'grid-cols-1' : 'grid-cols-3'} gap-1 md:gap-2 mb-4 w-full justify-items-center`}>
        {selectedCards.map((card, index) => (
          <div key={card.id} className={`flex flex-col items-center animate-slideUp group w-full bg-slate-900/40 md:bg-transparent rounded-[1.5rem] md:rounded-none p-1 md:p-0 border border-slate-700/50 md:border-none shadow-md md:shadow-none backdrop-blur-md md:backdrop-blur-none`} style={{ animationDelay: `${index * 200}ms` }}>
            <h3 className="text-[9px] md:text-base font-serif text-slate-300 font-bold mb-2 md:mb-4 tracking-widest uppercase drop-shadow-sm border-b-2 border-slate-700 pb-1">{card.position}</h3>
            <div className="cursor-pointer group/card transition-all duration-300 hover:scale-105 select-none" onClick={() => setViewingCard(card)}>
              <div className="w-28 h-[200px] sm:w-36 sm:h-64 rounded-xl overflow-hidden shadow-xl border border-slate-500/50 group-hover/card:border-slate-400 transition-all">
                <img src={`/image/${String(card.id).padStart(2, '0')}.jpg`} alt={`${card.nameKo} 타로 카드`} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-center mt-2 animate-fadeIn"><h3 className="text-slate-200 font-serif text-[11px] font-bold tracking-wider">{card.nameKo.split('(')[0].trim()}</h3></div>
            </div>
            <div className="mt-2 flex flex-col items-center transition-all duration-500 w-full">
              <div className="text-center relative bg-slate-900/60 px-2 py-2 rounded-xl backdrop-blur-sm w-full shadow-inner border border-slate-800">
                <div className={`absolute inset-0 blur-2xl opacity-10 ${card.isReversed ? 'bg-rose-600' : 'bg-emerald-600'}`}></div>
                <div className="text-[9px] text-slate-300 leading-tight font-medium relative z-10 break-keep flex flex-col items-center gap-0.5">
                  <span className={`font-bold ${card.isReversed ? 'text-rose-400' : 'text-emerald-400'}`}>{card.isReversed ? '역방향' : '정방향'}</span>
                  {(card.isReversed ? card.meaningRev : card.meaningUp).split(',').map((meaning, i) => (<span key={i} className="block">{meaning.trim()}</span>))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={getReading} className="mt-4 flex items-center gap-2 group shadow-lg"><Sparkles className="w-4 h-4 group-hover:animate-spin" />운명 해석하기</Button>
    </div>
  );
};

export default RevealScreen;
