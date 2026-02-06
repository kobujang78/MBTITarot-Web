
import React from 'react';

interface MbtiContent {
    title: string;
    icon: string;
    summary: string;
    attitude: string;
    question: string;
}

/* New MBTI Data Ordered by Group (Analysts, Diplomats, Sentinels, Explorers) */
const MBTI_TAROT_STYLES: Record<string, MbtiContent> = {
    // 분석가형 (Analysts)
    INTJ: {
        title: "용의주도한 전략가", icon: "♟️",
        summary: "타로를 통해 미래의 가능성을 시뮬레이션합니다. 막연한 위로보다는 구체적인 전략과 인과관계를 파악하는 데 집중합니다.",
        attitude: "감성적인 공감보다는 냉철한 분석을 원합니다. 패턴을 읽어내고, 목표 달성을 위한 최적의 경로와 방해 요소를 파악하여 마스터플랜을 수정합니다.",
        question: "목표 달성을 위한 가장 효율적인 전략은? / 내가 미처 보지 못한 맹점(Blind Spot)은?"
    },
    INTP: {
        title: "논리적인 사색가", icon: "🔬",
        summary: "카드의 상징을 분석하고 자신만의 논리로 재해석하는 것을 즐깁니다. 타로를 하나의 흥미로운 탐구 대상이자 퍼즐로 받아들입니다.",
        attitude: "해석의 논리적 정합성을 따집니다. 뻔한 답변보다는 새로운 관점을 제시하거나, 고정관념을 깨뜨려주는 지적인 자극을 주는 리딩을 높게 평가합니다.",
        question: "이 상황을 뒤집을 수 있는 역발상은? / 내가 놓치고 있는 논리적 오류는?"
    },
    ENTJ: {
        title: "대담한 통솔자", icon: "🚀",
        summary: "목표 달성을 위한 효율적인 조언을 구합니다. 장애물을 돌파하고 성공을 쟁취하기 위한 '행동 지침'으로서 타로를 활용합니다.",
        attitude: "운명에 끌려다니지 않고 운명을 지배하려 합니다. 자신의 판단에 확신을 더하거나, 리스크를 점검하기 위해 활용하며 권력과 성취를 지향합니다.",
        question: "가장 빠르게 정상에 오르는 길은? / 내 야망을 실현하는 데 방해가 되는 것은?"
    },
    ENTP: {
        title: "뜨거운 논쟁을 즐기는 변론가", icon: "💡",
        summary: "다양한 가능성을 열어두고 창의적인 영감을 얻기 위해 카드를 봅니다. 정해진 운명보다는 자신이 바꿀 수 있는 미래에 흥미를 느낍니다.",
        attitude: "운명에 순응하기보다는 개척하고 싶어 합니다. '안 된다'는 카드조차 도전 의식을 자극하는 신호로 받아들이며, 위기를 기회로 바꿀 아이디어를 찾습니다.",
        question: "남들이 생각하지 못한 기회는 어디에? / 이 판을 흔들 수 있는 변수는?"
    },

    // 외교관형 (Diplomats)
    INFJ: {
        title: "선의의 옹호자", icon: "🔮",
        summary: "깊은 통찰력으로 카드의 이미지 너머에 있는 본질을 꿰뚫어 봅니다. 내면의 목소리와 타로의 메시지를 연결하여 영적인 성장을 도모합니다.",
        attitude: "표면적인 결과보다는 '왜?'에 대한 근본적인 원인을 탐구합니다. 직관력이 뛰어나 카드의 이미지를 보고 스스로 깊은 통찰을 얻어내기도 합니다.",
        question: "이 시련이 나에게 주는 영적인 교훈은? / 나의 진정한 자아를 찾기 위한 여정은?"
    },
    INFP: {
        title: "열정적인 중재자", icon: "🌿",
        summary: "타로를 통해 자신의 감정을 치유하고 위로받기를 원합니다. 카드가 들려주는 이야기에 깊이 공감하며 자신만의 의미를 부여합니다.",
        attitude: "카드의 서사(Storytelling)에 몰입합니다. 현실적인 이득보다는 가치관, 꿈, 자아 실현에 대한 질문을 주로 하며, 진심 어린 위로에 감동합니다.",
        question: "나는 올바른 길을 가고 있는가? / 나의 소울메이트는 어떤 모습일까?"
    },
    ENFJ: {
        title: "정의로운 사회운동가", icon: "🌟",
        summary: "자신뿐만 아니라 주변 사람들과의 조화를 위해 타로를 봅니다. 관계를 개선하고 타인을 돕기 위한 긍정적인 메시지를 찾습니다.",
        attitude: "공동체의 발전과 성장을 위한 조언을 구합니다. 사람의 마음을 움직이는 비전과 영감을 주는 리딩에 깊이 감동하며, 이상적인 미래를 꿈꿉니다.",
        question: "내가 사람들에게 줄 수 있는 선한 영향력은? / 우리 팀을 더 잘 이끄는 지혜는?"
    },
    ENFP: {
        title: "재기발랄한 활동가", icon: "✨",
        summary: "타로 리딩을 하나의 신나는 모험으로 여깁니다. 카드가 보여주는 새로운 기회와 인연에 대해 설렘을 느끼며 긍정적인 에너지를 얻습니다.",
        attitude: "정해진 미래보다 열려 있는 가능성을 확인하고 싶어 합니다. 창의적인 아이디어를 얻거나 잠자고 있던 열정을 깨워주는 영감 가득한 리딩을 사랑합니다.",
        question: "나를 설레게 할 새로운 모험은? / 내가 가진 잠재력은 어디까지일까?"
    },

    // 관리자형 (Sentinels)
    ISTJ: {
        title: "청렴결백한 논리주의자", icon: "💎",
        summary: "검증된 해석과 전통적인 상징을 신뢰합니다. 모호한 말보다는 명확하고 현실적인 조언, 즉각적으로 실행 가능한 지침을 선호합니다.",
        attitude: "막연한 희망보다는 팩트와 데이터를 신뢰합니다. '그래서 지금 무엇을 해야 하는가?'에 대한 명확한 답변을 선호하며, 위로보다는 해결책을 원합니다.",
        question: "현재 문제의 실질적인 해결 방법은? / 이 선택의 장기적인 리스크는?"
    },
    ISFJ: {
        title: "용감한 수호자", icon: "🛡️",
        summary: "타로를 통해 현재의 안정을 지키고 미래의 불안을 해소하고자 합니다. 차분하고 따뜻한 조언에서 마음의 평화를 얻습니다.",
        attitude: "가족이나 친구, 연인의 안녕을 묻는 경우가 많습니다. 카드가 주는 정서적인 안정감과 구체적인 보호 방법을 찾으려 하며, 평화를 지키는 지혜를 구합니다.",
        question: "내가 좋아하는 그 사람의 속마음은? / 우리 가족의 평화를 지키기 위해 할 일은?"
    },
    ESTJ: {
        title: "엄격한 관리자", icon: "👔",
        summary: "현재 상황을 객관적으로 판단하기 위한 도구로 활용합니다. 감정적인 해석보다는 사실에 입각한, 질서 정연한 리딩을 원합니다.",
        attitude: "구체적인 날짜, 숫자, 행동 지침이 포함된 리딩을 신뢰합니다. 막연한 희망보다는 현실적인 경고와 조언을 받아들이며, 체크리스트로 활용합니다.",
        question: "목표 달성을 앞당길 수 있는 방법은? / 내가 통제해야 할 리스크는 무엇인가?"
    },
    ESFJ: {
        title: "사교적인 외교관", icon: "🤝",
        summary: "가족이나 친구와의 관계 운을 주로 봅니다. 주변 사람들과 잘 지내기 위한 구체적인 조언과 따뜻한 격려를 기대합니다.",
        attitude: "나 혼자의 운보다는 모두가 행복해지는 조화로운 결론을 선호합니다. 갈등 해결책을 찾고 싶어 하며, 따뜻한 칭찬과 격려를 좋아합니다.",
        question: "주변 사람들에게 더 사랑받는 방법은? / 우리 관계를 더 끈끈하게 만들려면?"
    },

    // 탐험가형 (Explorers)
    ISTP: {
        title: "만능 재주꾼", icon: "🔧",
        summary: "타로의 원리보다는 결과의 정확성에 관심이 많습니다. 현재 당면한 문제를 해결하기 위한 실용적이고 핵심적인 팁을 원합니다.",
        attitude: "군더더기 없는 핵심적인 리딩을 좋아합니다. 긴 설명보다는 'Do & Don't'가 명확한 답변을 원하며, 임기응변의 묘수를 찾습니다.",
        question: "지금 당장 이 문제를 해결할 묘수는? / 가장 적은 노력으로 최대 효과를 낼 방법은?"
    },
    ISFP: {
        title: "호기심 많은 예술가", icon: "🎨",
        summary: "카드의 아름다운 이미지와 분위기 그 자체를 즐깁니다. 직관적인 느낌을 중시하며, 타로를 통해 자신의 미적 감각을 충족시킵니다.",
        attitude: "논리적인 설명보다는 카드가 주는 '느낌'에 의존합니다. 부드럽고 서정적인 해석을 통해 마음의 평화를 얻고 싶어 합니다.",
        question: "지금 내 마음이 진정으로 원하는 것은? / 나를 더 아름답게 표현할 수 있는 방법은?"
    },
    ESTP: {
        title: "모험을 즐기는 사업가", icon: "🎲",
        summary: "인생의 베팅을 위한 참고 자료로 활용합니다. 길고 지루한 설명보다는, 지금 당장 무엇을 해야 이득인지 빠르고 명쾌한 답을 원합니다.",
        attitude: "지루한 분석은 질색입니다. '지금 당장' 기회를 잡을 수 있는 타이밍을 선호합니다. 다이나믹한 미래와 스릴 넘치는 도전을 즐깁니다.",
        question: "지금 내 눈앞에 있는 기회는? / 어디에 승부를 걸어야 대박이 날까?"
    },
    ESFP: {
        title: "자유로운 영혼의 연예인", icon: "🎉",
        summary: "타로 리딩 자체를 즐거운 이벤트로 생각합니다. 친구들과 함께 결과를 공유하며 웃고 즐길 수 있는 유쾌한 해석을 선호합니다.",
        attitude: "심각하고 어두운 얘기보다는 희망차고 긍정적인 메시지를 듣고 싶어 합니다. 애정운이나 인기운에 관심이 많으며, 리딩 과정을 즐깁니다.",
        question: "이번 주 나를 주인공으로 만들어줄 사건은? / 새로운 만남이 기다리고 있을까?"
    },
};

// Generate Dynamic FAQ Schema combining Basic FAQs + MBTI Content
const generateFaqSchema = () => {
    const baseQuestions = [
        {
            "@type": "Question",
            "name": "MBTI 타로는 일반 타로와 무엇이 다른가요?",
            "acceptedAnswer": { "@type": "Answer", "text": "일반적인 타로가 질문자의 상황을 무작위적인 상징으로 해석한다면, MBTI 타로는 질문자의 고유한 성격 유형(인지 기능)을 필터로 사용하여 해석합니다." }
        },
        {
            "@type": "Question",
            "name": "타로 결과는 얼마나 신뢰할 수 있나요?",
            "acceptedAnswer": { "@type": "Answer", "text": "타로는 미래를 확정적으로 예지하는 도구가 아니라, 사용자의 무의식을 투영하여 스스로 해답을 찾도록 돕는 도구입니다. 심리학적 분석을 더해 신뢰도를 높였습니다." }
        },
        {
            "@type": "Question",
            "name": "같은 질문을 여러 번 해도 되나요?",
            "acceptedAnswer": { "@type": "Answer", "text": "타로는 순간의 에너지와 집중력이 중요하므로, 같은 질문은 하루에 한 번만 하시는 것을 권장합니다." }
        }
    ];

    const mbtiQuestions = Object.entries(MBTI_TAROT_STYLES).map(([type, content]) => ({
        "@type": "Question",
        "name": `${type}(${content.title})는 어떤 타로 해석을 선호하나요?`,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": `${content.summary} ${content.attitude}`
        }
    }));

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [...baseQuestions, ...mbtiQuestions]
    };
};

const LandingContent: React.FC = () => {
    const [activeMbti, setActiveMbti] = React.useState<string>('INTJ'); // Default expanded (First item)

    return (
        <div className="w-full max-w-3xl mx-auto mt-12 px-4 space-y-12 text-slate-300 pb-12 animate-fadeIn">
            {/* Section 1: Service Introduction */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100 border-b border-slate-700 pb-2">
                    MBTI 타로운세란 무엇인가요?
                </h2>
                <p className="leading-relaxed text-sm md:text-base text-slate-400">
                    MBTI 타로운세는 고대의 지혜인 <strong>타로(Tarot)</strong>와 현대 심리학의 결정체인 <strong>MBTI 성격 유형 검사</strong>를 결합한 혁신적인 운세 서비스입니다.
                    단순히 무작위로 카드를 뽑는 것을 넘어, 당신의 성향(MBTI)이 카드의 에너지와 어떻게 상호작용하는지를 분석합니다.
                    ISTJ의 신중함부터 ENFP의 열정까지, 16가지 성격 유형에 따라 같은 카드라도 전혀 다른 조언이 될 수 있습니다.
                    오늘 당신에게 필요한 메시지를 발견해보세요.
                </p>
            </section>

            {/* Section 2: Tarot Wisdom */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100 border-b border-slate-700 pb-2">
                    타로 카드가 보여주는 삶의 이정표
                </h2>
                <div className="md:flex gap-6 items-start">
                    <div className="flex-1 space-y-3">
                        <h3 className="text-lg font-bold text-slate-200">메이저 아르카나 (Major Arcana)</h3>
                        <p className="leading-relaxed text-sm md:text-base text-slate-400">
                            0번 '바보(The Fool)'부터 21번 '세계(The World)'까지, 인생의 큰 흐름과 영적인 교훈을 담고 있습니다.
                            이 카드들이 나타날 때는 당신의 삶에 중요한 변화나 깨달음이 찾아오고 있음을 의미할 수 있습니다.
                        </p>
                    </div>
                    <div className="flex-1 space-y-3 mt-4 md:mt-0">
                        <h3 className="text-lg font-bold text-slate-200">마이너 아르카나 (Minor Arcana)</h3>
                        <p className="leading-relaxed text-sm md:text-base text-slate-400">
                            지팡이(Wands), 컵(Cups), 검(Swords), 동전(Pentacles)의 4가지 슈트로 구성되어 있습니다.
                            일상의 구체적인 사건, 감정, 갈등, 그리고 실질적인 문제들을 다루며 현실적인 조언을 제공합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: How to Use */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100 border-b border-slate-700 pb-2">
                    운세를 100% 활용하는 방법
                </h2>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-slate-400 marker:text-indigo-400">
                    <li>
                        <strong>마음을 비우고 집중하세요:</strong> 카드를 섞고 뽑는 순간의 에너지가 중요합니다. 조용한 곳에서 심호흡을 하세요.
                    </li>
                    <li>
                        <strong>구체적인 질문을 떠올리세요:</strong> 단순히 "내 운세는?" 보다는 "이번 프로젝트에서 주의할 점은?" 처럼 구체적일수록 좋습니다.
                    </li>
                    <li>
                        <strong>정방향과 역방향:</strong> 카드가 뒤집혀 나왔다고 해서 반드시 나쁜 것은 아닙니다. 부족한 에너지를 채우라는 신호일 수 있습니다.
                    </li>
                    <li>
                        <strong>결과를 맹신하지 마세요:</strong> 타로는 미래를 확정 짓는 것이 아니라, 가능한 흐름을 보여주는 나침반입니다. 선택은 당신의 몫입니다.
                    </li>
                </ul>
            </section>

            {/* Section 4: MBTI & Tarot Connection */}
            <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100 border-b border-slate-700 pb-2">
                    성격 유형별 타로 해석의 차이
                </h2>
                <p className="leading-relaxed text-sm md:text-base text-slate-400">
                    분석적이고 논리적인 <strong>NT(분석가형)</strong> 유형에게 타로는 전략적인 통찰을 제공하며, 감성적이고 이상적인 <strong>NF(외교관형)</strong> 유형에게는 정서적 위로와 영감을 줍니다.
                    현실적인 <strong>SJ(관리자형)</strong> 유형에게는 실질적인 해결책을, 자유로운 <strong>SP(탐험가형)</strong> 유형에게는 새로운 기회의 가능성을 시사합니다.
                    자신의 MBTI를 설정하고 카드를 뽑으면, 이러한 성향을 고려한 맞춤형 해석을 받아볼 수 있습니다.
                </p>
            </section>

            {/* Section: MBTI Type Tarot Guide Encyclopedia */}
            <section className="space-y-6">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100 border-b border-slate-700 pb-2">
                    MBTI 별 타로 해석 스타일 가이드
                </h2>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Grid Buttons */}
                    <div className="grid grid-cols-4 gap-2 md:w-1/2 content-start h-fit bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                        {Object.keys(MBTI_TAROT_STYLES).map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveMbti(type)}
                                className={`text-xs font-bold py-2.5 rounded-lg border transition-all duration-200 ${activeMbti === type
                                    ? 'bg-indigo-600 text-white border-indigo-400 scale-105 shadow-md shadow-indigo-900/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Content Display - SEO Friendly: All contents are rendered but hidden via CSS */}
                    <div className="md:w-1/2 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 shadow-inner min-h-[320px] relative overflow-hidden backdrop-blur-sm">
                        {Object.entries(MBTI_TAROT_STYLES).map(([type, content]) => (
                            <div
                                key={type}
                                className={`transition-opacity duration-300 absolute inset-0 p-5 overflow-y-auto custom-scrollbar ${activeMbti === type ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute pointer-events-none hidden'}`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl filter drop-shadow-md">{content.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100 font-serif tracking-wider">
                                            {type}
                                        </h3>
                                        <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">
                                            {content.title}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                                    <div>
                                        <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 성격 요약
                                        </h4>
                                        <p className="text-slate-400 pl-3.5">{content.summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 타로를 대하는 태도
                                        </h4>
                                        <p className="text-slate-400 pl-3.5">{content.attitude}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 추천 질문
                                        </h4>
                                        <p className="text-indigo-300 pl-3.5 font-medium italic">"{content.question}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: FAQ (Frequently Asked Questions) */}
            <section className="space-y-6" id="faq">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100 border-b border-slate-700 pb-2 flex items-center gap-2">
                    <span className="text-indigo-400">Q&A</span> 자주 묻는 질문
                </h2>
                <div className="grid gap-4">
                    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                        <h3 className="font-bold text-slate-200 mb-2">Q. MBTI 타로는 일반 타로와 무엇이 다른가요?</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            일반적인 타로가 질문자의 상황을 무작위적인 상징으로 해석한다면, MBTI 타로는 질문자의 고유한 성격 유형(인지 기능)을 필터로 사용하여 해석합니다.
                            예를 들어, 같은 '검의 여왕' 카드라도 논리적인 <strong>INTJ</strong>에게는 '냉철한 판단'으로, 감성적인 <strong>INFP</strong>에게는 '결단이 필요한 시기'로 다르게 해석되어 더욱 개인화된 조언을 제공합니다.
                        </p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                        <h3 className="font-bold text-slate-200 mb-2">Q. 결과는 얼마나 신뢰할 수 있나요?</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            타로는 미래를 확정적으로 예지하는 도구가 아니라, 사용자의 무의식을 투영하여 스스로 해답을 찾도록 돕는 도구입니다.
                            MBTI 타로운세는 여기에 심리학적 분석을 더해 신뢰도를 높였으며, 단순한 미신이 아닌 <strong>자기 성찰의 도구</strong>로 활용하시길 권장합니다.
                        </p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                        <h3 className="font-bold text-slate-200 mb-2">Q. 같은 질문을 여러 번 해도 되나요?</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            타로는 순간의 에너지와 집중력이 중요하므로, <strong>같은 질문은 하루에 한 번만</strong> 하시는 것을 권장합니다.
                            결과가 마음에 들지 않는다고 계속 뽑는 것은 오히려 판단을 흐리게 할 수 있습니다. 다른 질문이 있다면 언제든지 다시 이용하실 수 있습니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* JSON-LD for SEO: Expanded with MBTI details */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema()) }}
            />

            {/* Decorative Divider */}
            <div className="flex items-center justify-center py-8 opacity-30">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
                <div className="mx-4 text-slate-400 text-xs tracking-widest uppercase">Destiny Awaits</div>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
            </div>
        </div>
    );
};

export default LandingContent;
