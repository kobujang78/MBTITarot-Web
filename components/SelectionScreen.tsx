import React from 'react';
import { Info } from 'lucide-react';
import { CARD_BACK_IMAGE_URL } from '../constants';
import { TarotSpread, SelectedCard, TarotCard } from '../types';
import CardCarousel from './CardCarousel';

interface SelectionScreenProps {
  selectedSpread: TarotSpread;
  selectedCards: SelectedCard[];
  activeTooltipId: number | null;
  setActiveTooltipId: (id: number | null) => void;
  deck: TarotCard[];
  handleCardSelect: (card: TarotCard) => void;
  triggerRotateSound: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({
  selectedSpread, selectedCards, activeTooltipId, setActiveTooltipId, deck, handleCardSelect, triggerRotateSound
}) => {
  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      <h2 className="text-2xl font-serif text-slate-200 mb-2 font-bold bg-slate-900/60 px-6 py-2 rounded-full backdrop-blur-sm border border-slate-800">운명의 카드 선택</h2>
      <div className="mb-2 flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-md">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
          <span className="text-sm font-serif text-slate-400 tracking-widest uppercase font-semibold">
            {selectedCards.length < selectedSpread.cardCount ? `Pick ${selectedSpread.slots[selectedCards.length]?.title}` : 'Selection Complete'}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium italic h-4 bg-slate-900/40 px-2 rounded-md">
          {selectedSpread.slots[selectedCards.length]?.hint || "영험한 기운이 깃든 카드를 고르세요"}
        </span>
      </div>

      <div className={`grid ${selectedSpread.cardCount === 1 ? 'grid-cols-1' : 'grid-cols-3'} gap-2 sm:gap-4 mb-2 w-full max-w-2xl px-1 justify-items-center`}>
        {selectedSpread.slots.map((slot, idx) => {
          const card = selectedCards[idx];
          const isActive = card && activeTooltipId === card.id;
          return (
            <div key={idx} className="relative group">
              <div className={`relative w-24 h-[170px] sm:w-28 sm:h-[199px] rounded-lg border-2 ${card ? 'border-transparent shadow-[0_4px_15px_rgba(226,232,240,0.3)]' : 'border-dashed border-slate-600 bg-slate-900/40'} flex flex-col items-center justify-start transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden`}
                onClick={(e) => { if (card) { e.stopPropagation(); setActiveTooltipId(isActive ? null : card.id); } }}
                onMouseEnter={() => card && setActiveTooltipId(card.id)} onMouseLeave={() => setActiveTooltipId(null)}>
                {card ? (
                  <>
                    <img src={`/image/${String(card.id).padStart(2, '0')}.jpg`} alt={card.name} className={`w-full h-full object-cover rounded-lg ${card.isReversed ? 'rotate-180' : ''}`} />
                    {!isActive && <div className="absolute top-1 right-1 bg-slate-900/60 rounded-full p-0.5 shadow-sm z-20"><Info className="w-3 h-3 text-slate-400" /></div>}
                  </>
                ) : (
                  <div className="flex-1 w-full h-full relative group">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
                      <div className="w-12 h-20 mb-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <img src={CARD_BACK_IMAGE_URL} alt="placeholder" className="w-full h-full object-cover rounded-sm grayscale" />
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-serif uppercase tracking-widest font-bold drop-shadow-md">{slot.title}</span>
                    </div>
                    <div className="absolute inset-0 bg-slate-900/40 rounded-lg"></div>
                  </div>
                )}
              </div>
              {card && isActive && (
                <div className="absolute z-50 w-60 sm:w-64 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-xl backdrop-blur-md animate-fadeIn text-left pointer-events-none sm:pointer-events-auto bottom-full left-1/2 -translate-x-1/2 mb-4 md:bottom-auto md:left-full md:top-0 md:ml-4 md:mb-0 md:translate-x-0">
                  <div className="flex justify-between items-start mb-3 border-b border-slate-700 pb-2">
                    <div><p className="text-slate-200 font-bold text-sm">{card.nameKo.split('(')[0].trim()}</p><p className="text-slate-500 text-[10px]">{card.name}</p></div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${card.isReversed ? 'border-rose-800 text-rose-400 bg-rose-900/30' : 'border-emerald-800 text-emerald-400 bg-emerald-900/30'}`}>{card.isReversed ? '역방향' : '정방향'}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className={!card.isReversed ? 'opacity-100' : 'opacity-40 grayscale'}><span className="text-emerald-500 font-bold block mb-0.5">정방향 (Upright)</span><span className="text-slate-400 leading-snug">{card.meaningUp}</span></div>
                    <div className={card.isReversed ? 'opacity-100' : 'opacity-40 grayscale'}><span className="text-rose-500 font-bold block mb-0.5">역방향 (Reversed)</span><span className="text-slate-400 leading-snug">{card.meaningRev}</span></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative w-full max-w-6xl animate-fadeIn delay-300">
        <CardCarousel cards={deck.filter(c => !selectedCards.some(s => s.id === c.id))} onSelect={handleCardSelect} onRotate={triggerRotateSound} />
      </div>

      <div className="mt-8 text-center max-w-lg px-6 py-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 backdrop-blur-sm animate-fadeIn delay-500">
        <h3 className="text-slate-400 font-bold mb-2 text-sm">💡 카드 선택 팁</h3>
        <p className="text-slate-500 text-xs leading-relaxed">카드의 뒷면을 바라보며 마음에 드는 카드를 직관적으로 선택하세요. 너무 오래 고민하기보다는 처음 눈길이 가는 카드가 종종 가장 정확한 메시지를 담고 있습니다. 당신의 무의식이 이끄는 대로 카드를 클릭하세요.</p>
      </div>
    </div>
  );
};

export default SelectionScreen;
