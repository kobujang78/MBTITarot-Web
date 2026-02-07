import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MBTI_INTRO_TITLE, MBTI_INTRO_CONTENT, MBTI_DETAILS } from '../services/contentData';
import { MBTI_TYPES } from '../constants';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Button from './Button';

const MbtiAbout: React.FC = () => {
    const [selectedMbti, setSelectedMbti] = useState<string | null>(null);

    // Filter out '공통' from MBTI_TYPES for the grid
    const mbtiList = MBTI_TYPES.filter(type => type !== '공통');

    if (selectedMbti) {
        const detailContent = MBTI_DETAILS[selectedMbti] || "내용을 불러올 수 없습니다.";

        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
                <button
                    onClick={() => setSelectedMbti(null)}
                    className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    목록으로 돌아가기
                </button>

                <article className="prose prose-invert prose-lg max-w-none bg-slate-900/50 p-6 md:p-10 rounded-2xl border border-white/10 shadow-xl">
                    <ReactMarkdown>{detailContent}</ReactMarkdown>
                </article>

                <div className="mt-8 flex justify-center">
                    <Button onClick={() => setSelectedMbti(null)} variant="secondary">
                        다른 유형 보기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-200 mb-4">
                    {MBTI_INTRO_TITLE}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto"></div>
            </div>

            <article className="prose prose-invert prose-lg max-w-none mb-12 bg-slate-900/40 p-6 rounded-xl border border-white/5">
                <ReactMarkdown>{MBTI_INTRO_CONTENT}</ReactMarkdown>
            </article>

            <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
                <BookOpen className="w-6 h-6 mr-2 text-sky-400" />
                16가지 성격 유형 상세 보기
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mbtiList.map((mbti) => (
                    <button
                        key={mbti}
                        onClick={() => setSelectedMbti(mbti)}
                        className="group relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20"
                    >
                        <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <span className="block text-2xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">{mbti}</span>
                            <span className="text-xs text-slate-400 group-hover:text-slate-200">상세설명 보기 &rarr;</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* SEO Text Block for AdSense Richness */}
            <div className="mt-16 p-6 bg-slate-900/30 rounded-lg border border-white/5 text-slate-400 text-sm leading-relaxed">
                <p>
                    MBTI 검사는 단순한 심리 테스트를 넘어, 자신을 이해하고 타인을 존중하는 도구로 널리 활용되고 있습니다.
                    각 유형은 우열이 없으며, 서로 다른 재능과 관점을 가지고 세상을 살아갑니다.
                    자신의 유형을 정확히 파악하고, 강점을 발전시키며 약점을 보완한다면 더 나은 삶을 설계할 수 있습니다.
                    MBTI 타로 운세 서비스는 이러한 성격 유형 이론과 타로의 직관적인 지혜를 결합하여, 당신에게 딱 맞는 맞춤형 조언을 제공합니다.
                </p>
            </div>
        </div>
    );
};

export default MbtiAbout;
