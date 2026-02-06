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
        const detail = MBTI_DETAILS[selectedMbti];
        return (
            <div className="w-full max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
                <button
                    onClick={() => setSelectedMbti(null)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>목록으로</span>
                </button>

                <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-8 border-b border-white/5">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-4xl">{detail.icon}</span>
                            <div>
                                <h2 className="text-3xl font-bold text-white font-serif">{selectedMbti}</h2>
                                <p className="text-indigo-400 font-bold tracking-widest text-sm">{detail.title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 prose prose-invert max-w-none">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 성격 요약
                            </h3>
                            <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                                {detail.summary}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 타로를 대하는 태도
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {detail.attitude}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 추천 질문
                                </h3>
                                <p className="text-indigo-300 font-medium italic bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                                    "{detail.question}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">{MBTI_INTRO_TITLE}</h1>
                <div className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed">
                    <ReactMarkdown>{MBTI_INTRO_CONTENT}</ReactMarkdown>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mbtiList.map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedMbti(type)}
                        className="group relative bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl mb-1 filter group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all">
                                {MBTI_DETAILS[type]?.icon || '✨'}
                            </span>
                            <h3 className="text-xl font-bold text-slate-200 font-serif">{type}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                                {MBTI_DETAILS[type]?.title.split(' ')[0]}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MbtiAbout;
