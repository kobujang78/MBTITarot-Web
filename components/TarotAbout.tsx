import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { TAROT_INTRO_TITLE, TAROT_INTRO_CONTENT, getTarotRichDescription } from '../services/contentData';
import { ALL_CARDS, CARD_BACK_IMAGE_URL } from '../constants';
import { ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { TarotCard } from '../types';
import Button from './Button';

const TarotAbout: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

    // Group cards
    const majorArcana = useMemo(() => ALL_CARDS.filter(c => c.id <= 21), []);
    const minorArcana = useMemo(() => ALL_CARDS.filter(c => c.id > 21), []);

    if (selectedCard) {
        const richDesc = getTarotRichDescription(selectedCard.id);
        return (
            <div className="w-full max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
                <button
                    onClick={() => setSelectedCard(null)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>목록으로</span>
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-slate-800 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-700">
                            <div className="w-40 h-64 rounded-xl overflow-hidden shadow-2xl border border-slate-600">
                                <img
                                    src={`/image/${String(selectedCard.id).padStart(2, '0')}.jpg`}
                                    alt={selectedCard.name}
                                    className="w-full h-full object-fill"
                                />
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h2 className="text-3xl font-bold text-white font-serif mb-1">{selectedCard.nameKo}</h2>
                            <p className="text-indigo-400 font-bold tracking-widest text-sm mb-6 uppercase">{selectedCard.name}</p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">키워드 (Keywords)</h3>
                                    <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                                        {selectedCard.keywords.map(k => (
                                            <span key={k} className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">{k}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">카드 의미 (Meaning)</h3>
                                    <p className="text-slate-300 leading-relaxed text-sm">{richDesc.meaning}</p>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">심볼리즘 (Symbolism)</h3>
                                    <p className="text-slate-400 leading-relaxed text-xs italic">{richDesc.symbolism}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">{TAROT_INTRO_TITLE}</h1>
                <div className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed">
                    <ReactMarkdown>{TAROT_INTRO_CONTENT}</ReactMarkdown>
                </div>
            </div>

            <div className="space-y-12">
                {/* Major Arcana */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-serif">메이저 아르카나 (Major Arcana)</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {majorArcana.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => setSelectedCard(card)}
                                className="group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-2xl transition-all duration-300"
                            >
                                <div className="aspect-[2/3] w-full bg-slate-800 rounded-xl overflow-hidden mb-3 border border-slate-700">
                                    <img
                                        src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                                        alt={card.name}
                                        className="w-full h-full object-fill grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100"
                                    />
                                </div>
                                <h3 className="text-xs font-bold text-slate-300 truncate">{card.nameKo}</h3>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Minor Arcana */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-serif">마이너 아르카나 (Minor Arcana)</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {minorArcana.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => setSelectedCard(card)}
                                className="group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-2xl transition-all duration-300"
                            >
                                <div className="aspect-[2/3] w-full bg-slate-800 rounded-xl overflow-hidden mb-3 border border-slate-700">
                                    <img
                                        src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                                        alt={card.name}
                                        className="w-full h-full object-fill grayscale group-hover:grayscale-0 transition-all duration-500 opacity-40 group-hover:opacity-100"
                                    />
                                </div>
                                <h3 className="text-xs font-bold text-slate-400 truncate">{card.nameKo}</h3>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TarotAbout;
