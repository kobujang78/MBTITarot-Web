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
    const majorArcana = useMemo(() => ALL_CARDS.slice(0, 22), []);
    const wands = useMemo(() => ALL_CARDS.slice(22, 36), []);
    const cups = useMemo(() => ALL_CARDS.slice(36, 50), []);
    const swords = useMemo(() => ALL_CARDS.slice(50, 64), []);
    const pentacles = useMemo(() => ALL_CARDS.slice(64, 78), []);

    if (selectedCard) {
        let type: 'MAJOR' | 'WANDS' | 'CUPS' | 'SWORDS' | 'PENTACLES' = 'MAJOR';
        if (selectedCard.id >= 22 && selectedCard.id < 36) type = 'WANDS';
        else if (selectedCard.id >= 36 && selectedCard.id < 50) type = 'CUPS';
        else if (selectedCard.id >= 50 && selectedCard.id < 64) type = 'SWORDS';
        else if (selectedCard.id >= 64) type = 'PENTACLES';

        const detailContent = getTarotRichDescription(
            selectedCard.name,
            selectedCard.nameKo,
            selectedCard.meaningUp,
            selectedCard.meaningRev,
            type
        );

        // Determine image URL - assuming local images follow a naming convention or referencing externally if previously set up
        // In this project, images seem to be referenced via ID (e.g., /image/0.jpg) based on previous context memory, 
        // or just using the ID. Let's try to assume /image/{id}.jpg format which is common in this project history.
        const imageUrl = `/image/${String(selectedCard.id).padStart(2, '0')}.jpg`;

        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
                <button
                    onClick={() => setSelectedCard(null)}
                    className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    목록으로 돌아가기
                </button>

                <div className="bg-slate-900/50 p-6 md:p-10 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                        <div className="w-48 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/20">
                            <img
                                src={imageUrl}
                                alt={selectedCard.nameKo}
                                className="w-full h-auto object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = CARD_BACK_IMAGE_URL; }}
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold font-serif text-white mb-2">{selectedCard.nameKo}</h2>
                            <h3 className="text-xl text-sky-400 font-serif mb-4">{selectedCard.name}</h3>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-sky-900/40 text-sky-200 text-sm rounded-full border border-sky-500/30">
                                    #{selectedCard.imageKeyword}
                                </span>
                                <span className="px-3 py-1 bg-indigo-900/40 text-indigo-200 text-sm rounded-full border border-indigo-500/30">
                                    {type}
                                </span>
                            </div>
                        </div>
                    </div>

                    <article className="prose prose-invert prose-lg max-w-none">
                        <ReactMarkdown>{detailContent}</ReactMarkdown>
                    </article>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button onClick={() => setSelectedCard(null)} variant="secondary">
                        다른 카드 보기
                    </Button>
                </div>
            </div>
        );
    }

    const CardGrid = ({ title, cards }: { title: string, cards: TarotCard[] }) => (
        <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-300 mb-4 border-b border-white/10 pb-2 pl-2 border-l-4 border-l-sky-500">
                {title}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className="group flex flex-col items-center"
                    >
                        <div className="w-full aspect-[2/3] rounded-lg overflow-hidden border border-white/10 relative shadow-lg group-hover:border-sky-400 transition-all duration-300 group-hover:-translate-y-1">
                            <img
                                src={`/image/${String(card.id).padStart(2, '0')}.jpg`}
                                alt={card.nameKo}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).src = CARD_BACK_IMAGE_URL; }}
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <span className="mt-2 text-xs md:text-sm text-slate-400 group-hover:text-white text-center font-medium truncate w-full px-1">
                            {card.nameKo.split('(')[0].trim()}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 mb-4">
                    {TAROT_INTRO_TITLE}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
            </div>

            <article className="prose prose-invert prose-lg max-w-none mb-12 bg-slate-900/40 p-6 rounded-xl border border-white/5">
                <ReactMarkdown>{TAROT_INTRO_CONTENT}</ReactMarkdown>
            </article>

            <div className="bg-slate-900/20 p-4 md:p-8 rounded-2xl border border-white/5">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center">
                    <Layers className="w-6 h-6 mr-2 text-purple-400" />
                    78장 타로 카드 도감
                </h3>

                <CardGrid title="메이저 아르카나 (Major Arcana)" cards={majorArcana} />
                <CardGrid title="마이너 아르카나 - 지팡이 (Wands)" cards={wands} />
                <CardGrid title="마이너 아르카나 - 성배 (Cups)" cards={cups} />
                <CardGrid title="마이너 아르카나 - 검 (Swords)" cards={swords} />
                <CardGrid title="마이너 아르카나 - 동전 (Pentacles)" cards={pentacles} />
            </div>

            {/* SEO Text Block */}
            <div className="mt-16 p-6 bg-slate-900/30 rounded-lg border border-white/5 text-slate-400 text-sm leading-relaxed">
                <p>
                    타로 카드는 단순한 점술 도구가 아니라, 인간의 무의식과 원형을 탐구하는 심오한 도구입니다.
                    78장의 카드는 우리가 인생에서 겪을 수 있는 모든 경험과 감정을 담고 있습니다.
                    각 카드의 상징을 이해하고 자신의 삶에 비추어 본다면, 고민에 대한 해답뿐만 아니라 삶의 지혜와 영감을 얻을 수 있을 것입니다.
                    MBTI 타로 운세는 이러한 타로의 깊이 있는 세계를 당신에게 안내합니다.
                </p>
            </div>
        </div>
    );
};

export default TarotAbout;
