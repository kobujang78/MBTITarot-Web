import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Stars, Moon, User, ChevronLeft, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { SelectedCard, TarotSpread, TarotCard } from '../types';
import Button from './Button';

interface ReadingScreenProps {
  isLoading: boolean;
  selectedCards: SelectedCard[];
  setViewingCard: (card: TarotCard) => void;
  moonData: any;
  selectedMbti: string;
  readingSections: any[];
  currentPage: number;
  setCurrentPage: (p: number | ((prev: number) => number)) => void;
  isHistoryMode: boolean;
  selectedSpread: TarotSpread;
  question: string;
  readingRef: React.RefObject<HTMLDivElement | null>;
  shareToKakao: () => void;
  performShare: (type: 'text' | 'image' | 'both') => void;
  openHistory: () => void;
  handleResetClick: () => void;
  GoogleAd: React.FC<{ type?: 'inline' | 'side' }>;
}

const ReadingScreen: React.FC<ReadingScreenProps> = ({
  isLoading, selectedCards, setViewingCard, moonData, selectedMbti, readingSections,
  currentPage, setCurrentPage, isHistoryMode, selectedSpread, question, readingRef,
  shareToKakao, performShare, openHistory, handleResetClick, GoogleAd
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl px-2 md:px-4 animate-fadeIn pb-24">
      {!isLoading && (
        <div className={`grid ${selectedCards.length === 1 ? 'grid-cols-1' : selectedCards.length === 5 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3'} gap-2 md:gap-4 mb-2 w-full max-w-4xl justify-items-center`}>
          {selectedCards.map((card, index) => (
            <div key={`${card.id}-${index}`} className="flex flex-col items-center group cursor-pointer animate-slideUp" style={{ animationDelay: `${index * 150}ms` }} onClick={() => setViewingCard(card)}>
              <div className="text-[10px] md:text-xs font-serif text-slate-400 font-bold mb-1.5 tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">{card.position}</div>
              <div className="w-20 h-36 md:w-28 md:h-[200px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-lg overflow-hidden border border-slate-700/50 group-hover:border-slate-500 bg-slate-900">
                <img src={`/image/${String(card.id).padStart(2, '0')}.jpg`} alt={card.name} className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`} />
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11px] md:text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{card.nameKo.split('(')[0].trim()}</div>
                <div className={`text-[10px] font-medium ${card.isReversed ? 'text-rose-400' : 'text-emerald-400'}`}>{card.isReversed ? '역방향' : '정방향'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="w-full flex justify-center mb-2 animate-fadeIn delay-300 md:gap-4 gap-2 flex-row flex-nowrap items-stretch">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 shadow-sm text-slate-300 text-[11px] sm:text-sm backdrop-blur-sm hover:bg-slate-800 transition-colors flex-1 justify-center min-w-0">
            <span className="text-base sm:text-xl shrink-0">{moonData.icon}</span>
            <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden">
              <span className="text-lg md:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 animate-shimmer whitespace-nowrap truncate">{moonData.phaseKo}</span>
              <span className="hidden sm:inline border-l border-slate-600 mx-2 h-3"></span>
              <span className="opacity-70 italic font-light truncate hidden sm:block">{moonData.influence}</span>
            </div>
          </div>
          {selectedMbti && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 shadow-sm text-slate-300 text-[11px] sm:text-sm backdrop-blur-sm hover:bg-slate-800 transition-colors flex-1 justify-center min-w-0">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <span className="text-lg md:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 animate-shimmer tracking-widest whitespace-nowrap">{selectedMbti}</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] animate-fadeIn w-full max-w-lg mx-auto">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-64 h-64 rounded-full border border-slate-500/30 animate-spin-slow"></div>
              <div className="absolute w-56 h-56 rounded-full border border-slate-400/20 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
              <div className="absolute inset-0 bg-slate-400/5 blur-[60px] rounded-full animate-pulse"></div>
              <div className="relative w-32 h-48 sm:w-40 sm:h-60">
                <div className="absolute inset-0 bg-slate-800/20 rounded-xl border border-slate-600/40 transform translate-x-4 translate-y-2 rotate-6 opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 bg-slate-700/30 rounded-xl border border-slate-500/50 transform -translate-x-4 translate-y-1 -rotate-3 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl border border-slate-500 shadow-[0_0_25px_rgba(226,232,240,0.15)] overflow-hidden flex items-center justify-center z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  <div className="relative z-10 flex flex-col items-center gap-2 opacity-80">
                    <Sparkles className="w-8 h-8 text-slate-300 animate-spin-slow" />
                    <div className="w-12 h-1 bg-slate-500/50 rounded-full mt-2"></div>
                    <div className="w-8 h-1 bg-slate-500/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              <Stars className="absolute -top-8 -right-8 w-6 h-6 text-slate-400 animate-bounce opacity-60" style={{ animationDuration: '3s' }} />
              <Moon className="absolute -bottom-4 -left-12 w-5 h-5 text-slate-500 animate-pulse opacity-60" />
            </div>
            <div className="mt-16 text-center space-y-3 relative z-10 bg-slate-900/40 px-8 py-6 rounded-2xl backdrop-blur-sm border border-slate-700/60 shadow-sm">
              <h3 className="text-xl md:text-2xl font-serif text-slate-300 font-bold tracking-wide flex items-center justify-center gap-3">
                <span className="animate-pulse">✨</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">운명을 읽어내는 중</span><span className="animate-pulse">✨</span>
              </h3>
              <p className="text-sm text-slate-500 font-medium italic">{selectedMbti ? `${selectedMbti}의 내면과 우주의 흐름을 연결하고 있습니다...` : '카드의 상징과 별들의 배치를 해석하고 있습니다...'}</p>
            </div>
          </div>
        ) : (
          <div ref={readingRef} className="w-full">
            <div className="flex flex-col items-center mb-2 border-b border-slate-700/50 pb-2 text-center relative bg-gradient-to-b from-slate-900/60 to-slate-800/40 p-4 rounded-xl backdrop-blur-md shadow-sm ring-1 ring-slate-700/50">
              {isHistoryMode && <span className="absolute top-0 right-0 sm:static sm:mb-2 text-xs text-slate-400 border border-slate-600 rounded-full px-3 py-1 bg-slate-800 shadow-sm">📜 기록 열람 중</span>}
              <div className="flex items-center justify-center gap-3 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                <span className="text-lg md:text-xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-100 animate-shimmer tracking-widest uppercase drop-shadow-md">{selectedSpread.name}</span>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              </div>
              {question && <h3 className="text-lg md:text-xl font-sans font-bold text-slate-200 py-1 leading-tight drop-shadow-sm">"{question}"</h3>}
            </div>

            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col relative transition-all duration-500">
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/50 text-center relative">
                  <h3 className="text-lg md:text-xl font-serif font-bold text-slate-100 drop-shadow-md">{readingSections[currentPage]?.title || "결과 분석"}</h3>
                  <div className="flex justify-center gap-1.5 mt-2">
                    {readingSections.map((_, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-slate-200 w-3' : 'bg-slate-600'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-3 md:p-5 overflow-y-auto custom-scrollbar bg-slate-900/40">
                  <div className="animate-fadeIn">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-lg md:text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-300 mb-3 mt-1 font-bold border-b border-slate-700/50 pb-2 drop-shadow-sm" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-base md:text-lg font-serif text-slate-100 mb-3 mt-5 font-bold flex items-center gap-2 border-l-4 border-slate-600 pl-3 py-1 bg-slate-800/20 rounded-r-md drop-shadow-sm" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-sm md:text-base font-serif text-slate-200 mb-2 mt-4 font-bold opacity-90" {...props} />,
                        p: ({ node, ...props }) => <p className="text-slate-300 leading-relaxed mb-4 text-[13px] md:text-[15px] font-normal tracking-wide break-keep" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-amber-200 font-bold drop-shadow-[0_0_1px_rgba(255,191,0,0.3)]" {...props} />,
                        li: ({ node, children, ...props }) => {
                          const text = String(children);
                          if (text.includes('chapter_link:')) {
                            const [_, index, title] = text.split(':');
                            return (
                              <button onClick={() => setCurrentPage(parseInt(index))} className="w-full bg-slate-800/60 hover:bg-slate-700/80 rounded-xl p-4 border border-slate-700/50 mb-1 transition-all duration-300 group flex items-center justify-center relative">
                                <div className="text-center"><span className="text-slate-200 font-medium group-hover:text-white px-2">{title}</span></div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-1 transition-all absolute right-4" />
                              </button>
                            );
                          }
                          return <li className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50 mb-2 list-none text-sm md:text-base text-slate-300" {...props}>{children}</li>
                        },
                        ul: ({ node, ...props }) => <ul className="space-y-1 my-2 pl-0" {...props} />,
                        hr: ({ node, ...props }) => <hr className="border-t border-slate-700 my-4" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-slate-500 pl-3 italic text-slate-400 my-3 text-sm" {...props} />,
                      }}
                    >
                      {readingSections[currentPage]?.content || "내용을 불러오는 중입니다..."}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                  <Button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} variant="secondary" className="!px-3 !py-1.5 !text-xs flex items-center gap-1 min-w-[80px] justify-center"><ChevronLeft className="w-3 h-3" /> 이전</Button>
                  <span className="text-[10px] text-slate-500 font-serif uppercase tracking-widest">Chapter {currentPage + 1}</span>
                  <Button onClick={() => setCurrentPage(p => Math.min(readingSections.length - 1, p + 1))} disabled={currentPage === readingSections.length - 1} variant="secondary" className={`!px-3 !py-1.5 !text-xs flex items-center gap-1 min-w-[80px] justify-center ${currentPage === readingSections.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}>다음 <ChevronRight className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row justify-center items-start gap-4 w-full relative">
        <GoogleAd type="side" />
        <div className="w-full max-w-4xl flex flex-col items-center">
          {!isLoading && (
            <div className="mt-8 w-full max-w-md mx-auto px-2 space-y-3">
              <div className="flex gap-1 w-full">
                <Button onClick={shareToKakao} className="flex-1 flex items-center justify-center gap-1 py-3 bg-[#FEE500] hover:bg-[#FDD835] text-slate-900 border-none shadow-lg active:scale-95 transition-all text-sm font-bold !px-0 !rounded-md">💬 카톡공유</Button>
                <Button onClick={() => performShare('text')} variant="secondary" className="flex-1 flex items-center justify-center gap-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 shadow-lg active:scale-95 transition-all text-sm font-bold !px-0 !rounded-md">📜 전체운세</Button>
                <Button onClick={() => performShare('image')} variant="secondary" className="flex-1 flex items-center justify-center gap-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 shadow-lg active:scale-95 transition-all text-sm font-bold !px-0 !rounded-md">📥 부적저장</Button>
              </div>
              <div className="flex gap-2 w-full">
                {isHistoryMode ? (
                  <Button onClick={openHistory} className="flex-1 flex items-center justify-center gap-2 group shadow-lg"><ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기</Button>
                ) : (
                  <Button onClick={handleResetClick} className="flex-1 flex items-center justify-center gap-2 group shadow-lg"><RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> 다른 운세 보기</Button>
                )}
              </div>
            </div>
          )}
        </div>
        <GoogleAd type="side" />
      </div>
    </div>
  );
};

export default ReadingScreen;
