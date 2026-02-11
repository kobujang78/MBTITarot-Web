import React from 'react';
import { History, ArrowLeft, Search, X, Calendar, BookOpen, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { SavedReading } from '../types';

interface HistoryScreenProps {
  resetApp: () => void;
  historySearch: string;
  setHistorySearch: (s: string) => void;
  historySort: 'newest' | 'oldest';
  setHistorySort: (s: 'newest' | 'oldest') => void;
  filteredHistory: SavedReading[];
  loadHistoryItem: (item: SavedReading) => void;
  toggleHistoryExpand: (e: React.MouseEvent, id: string) => void;
  expandedHistoryId: string | null;
  deleteHistoryItem: (e: React.MouseEvent, id: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({
  resetApp, historySearch, setHistorySearch, historySort, setHistorySort,
  filteredHistory, loadHistoryItem, toggleHistoryExpand, expandedHistoryId, deleteHistoryItem
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 animate-fadeIn h-[80vh]">
      <div className="flex items-center justify-between w-full mb-4 bg-slate-900/60 px-2 py-2.5 rounded-xl backdrop-blur-sm shadow-sm border border-slate-800">
        <button onClick={resetApp} className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 font-bold text-[13px] shrink-0 whitespace-nowrap">
          <ArrowLeft className="w-4 h-4" /> 돌아가기
        </button>
        <h2 className="text-base sm:text-xl font-serif text-slate-200 flex items-center gap-2 font-bold whitespace-nowrap">
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /> 운명의 기록
        </h2>
        <div className="w-4"></div>
      </div>

      <div className="w-full mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative bg-slate-900/90 border border-slate-700 rounded-lg flex items-center overflow-hidden focus-within:border-slate-400 transition-colors shadow-sm">
            <Search className="w-4 h-4 text-slate-500 ml-3 shrink-0" />
            <input type="text" placeholder="질문, MBTI, 카드로 검색..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="w-full bg-transparent border-none text-slate-200 placeholder-slate-600 py-3 px-3 focus:outline-none text-sm" />
            {historySearch && <button onClick={() => setHistorySearch('')} className="mr-2 text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>}
          </div>
        </div>
        <div className="relative min-w-[140px]">
          <div className="absolute inset-0 bg-slate-900/90 border border-slate-700 rounded-lg flex items-center px-3 py-3 focus-within:border-slate-400 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-500 mr-2" />
            <select value={historySort} onChange={(e) => setHistorySort(e.target.value as 'newest' | 'oldest')} className="bg-transparent border-none text-slate-300 text-sm focus:outline-none w-full appearance-none cursor-pointer">
              <option value="newest" className="bg-slate-900 text-slate-200">최신순 (Newest)</option>
              <option value="oldest" className="bg-slate-900 text-slate-200">오래된순 (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-900/30 rounded-2xl backdrop-blur-sm border border-slate-800">
            <BookOpen className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-medium">{historySearch ? "검색 결과가 없습니다." : "저장된 기록이 없습니다."}</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="relative bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-600 transition-all group overflow-hidden mb-4 shadow-sm hover:shadow-md backdrop-blur-sm">
              <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-800/50" onClick={() => loadHistoryItem(item)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400 font-serif tracking-wider font-bold">{item.dateString}</span>
                    {item.readingTypeName && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/30 text-indigo-400 border border-indigo-800/50">{item.readingTypeName}</span>}
                    {item.mbti && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{item.mbti}</span>}
                  </div>
                  <h3 className="text-lg text-slate-200 font-medium mb-2">{item.question}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.cards.map((card, i) => (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50 shadow-sm hover:border-slate-600 transition-colors">
                        <div className="w-6 h-10 flex-shrink-0 overflow-hidden rounded-[2px] border border-slate-700">
                          <img src={`/image/${String(card.id).padStart(2, '0')}.jpg`} alt={card.name} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} />
                        </div>
                        <span className="text-[11px] font-medium leading-none">{card.nameKo.split('(')[0].trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <button onClick={(e) => toggleHistoryExpand(e, item.id)} className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full transition-colors">
                    {expandedHistoryId === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button onClick={(e) => deleteHistoryItem(e, item.id)} className="absolute top-3 right-3 p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors md:opacity-0 group-hover:opacity-100 z-10">
                <Trash2 className="w-4 h-4" />
              </button>

              {expandedHistoryId === item.id && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-800 animate-fadeIn bg-slate-900/50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {item.cards.map((card, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-sm shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-slate-400 text-xs font-serif uppercase tracking-wider font-bold">{card.position}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${card.isReversed ? 'bg-rose-900/30 text-rose-400 border border-rose-800' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'}`}>{card.isReversed ? '역방향' : '정방향'}</span>
                        </div>
                        <div className="flex gap-4 items-start">
                          <div className="w-16 h-28 flex-shrink-0 overflow-hidden rounded-md border border-slate-700 shadow-md">
                            <img src={`/image/${String(card.id).padStart(2, '0')}.jpg`} alt={card.name} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 mb-1 text-base leading-tight">{card.nameKo.split('(')[0].trim()}</div>
                            <div className="text-slate-500 text-[10px] italic mb-2">{card.name}</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs border-t border-slate-700 pt-2">
                          <div className={!card.isReversed ? "opacity-100" : "opacity-40"}><span className="text-emerald-500 block mb-0.5 font-bold">✦ 정방향 (Upright)</span><span className="text-slate-400 leading-tight block">{card.meaningUp}</span></div>
                          <div className={card.isReversed ? "opacity-100" : "opacity-40"}><span className="text-rose-500 block mb-0.5 font-bold">✦ 역방향 (Reversed)</span><span className="text-slate-400 leading-tight block">{card.meaningRev}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
