import { GoogleGenAI } from "@google/genai";
import { SelectedCard } from "../types";
import { getMoonData } from "./astrologyService";

export const getTarotReading = async (
  question: string,
  cards: SelectedCard[],
  mbti?: string,
  readingTypeName: string = "운명의 흐름",
  nickname?: string
): Promise<string> => {
  try {
    const moonData = getMoonData();
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Use nickname if available. If NOT, use natural pronouns or omission strategies.
    // Forbidden words: "미지님", "공통"
    const userTitle = nickname ? `${nickname}님` : "당신";

    // Check for valid API Key
    if (!apiKey || apiKey.includes('PLACEHOLDER')) {
      console.warn("Using Mock Response due to missing/invalid API Key");
      return getMockReading(question, cards, mbti, moonData, readingTypeName, nickname);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const isLotto = readingTypeName === "로또운";
    const lottoInstructions = isLotto ? `
      ### 🎰 로또운 특화 지침
      *   **행운의 요소**: 리딩 본문 어딘가에 카드의 상징을 바탕으로 한 **[행운의 방향, 추천 일자, 추천 시간대, 행운의 색상, 행운의 장소]**를 구체적인 팁처럼 자연스럽게 포함하세요.
      *   **마치는 글**: 반드시 "이 결과는 재미로만 즐겨주세요"라는 멘트와 함께, "결과와 상관없이 ${userTitle}의 노력과 나아가는 자세가 밝은 미래를 만듭니다"라는 메시지로 마무리하세요.
    ` : "";

    const isNewYear = readingTypeName === "신년운세";
    const newYearInstructions = isNewYear ? `
      ### 📅 신년운세 특화 지침
      *   **기준 연도**: 현재는 2025년 12월입니다. 다가오는 **2026년(병오년)**의 신년운세를 리딩해 주세요.
      *   **주의**: 리딩 본문에서 연도를 언급할 때는 반드시 **2026년** 또는 **병오년(丙午年)**으로 지칭하세요. 절대 2024년이나 2025년으로 혼동하지 마세요.
    ` : "";

    const prompt = `
      ### 🎭 Persona & Role
      당신은 현대 심리학(MBTI)과 고대 점술(타로, 점성술)을 결합하여 인간의 내면을 꿰뚫어 보는 '미스틱 타로 마스터'입니다. 
      ${userTitle}의 고민을 단순히 해결하는 것을 넘어, 성격적 특성과 우주의 에너지를 연결하여 영혼의 성장을 돕는 깊이 있는 통찰을 제공합니다.

      ### 🌌 Reading Context
      *   **현재 날짜**: ${new Date().toLocaleDateString('ko-KR')}
      *   **질문**: "${question || (isNewYear ? "2026년 신년운세" : "전반적인 운세의 흐름")}"
      *   **리딩 유형**: ${readingTypeName}
      *   **사용자 성향(MBTI)**: ${mbti || "미지 (일반적인 상징으로 해석)"}
      *   **사용자 닉네임**: ${nickname || "미지"}
      *   **현재의 달 (위상)**: ${moonData.phaseKo} (${moonData.influence})

      ${lottoInstructions}
      ${newYearInstructions}

      ### 🃏 The Spread (Selected Cards)
      ${cards.map(c => `
      [${c.position}] - ${c.nameKo} (${c.name})
      - 방향: ${c.isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
      - 상징: "${c.isReversed ? c.meaningRev : c.meaningUp}"`).join('')}

      ### 🎯 Reading Strategy (강화된 지침)
      1.  **이미지 리딩 (Atmospheric Start)**: 각 섹션을 시작할 때, 카드의 시각적 분위기나 느껴지는 에너지를 한 문장으로 묘사하며 신비로움을 더하세요.
      2.  **심리-타로 시너지 (The Resonance)**: 카드의 의미를 나열하지 마세요. ${mbti ? `${userTitle}의 MBTI 인지 기능과 카드의 상징이 충돌하거나 공명하는 지점을 날카롭게 분석하세요.` : '보편적인 인간의 심리 기제와 카드의 archetypes를 연결하세요.'}
      3.  **달의 에너지 활용**: ${moonData.phaseKo}의 기운이 현재의 고민에 어떤 '운명적 부스터'나 '주의 신호'가 되는지 리딩 전체에 녹여내세요.
      4.  **세련된 한국어**: '해요체'를 사용하되, 고풍스럽고 우아한 어휘를 선택하세요.
      5.  **Personalized Address**: 사용자를 지칭할 때는 항상 "${userTitle}"이라는 표현을 사용하세요. 절대 "당신"이라는 표현을 단독으로 쓰지 마세요.

      ### 📜 Output Constraints (반드시 준수할 것)
      - **HIGHLIGHT WITH COLOR**: 중요한 키워드나 핵심 문장은 반드시 **별표 두 개(**)**로 감싸서 강조하세요. (예: **핵심 통찰**) -> 이는 프론트엔드에서 색상으로 표현됩니다.
      - **NO "COMMON" WORD**: "공통", "일반적인"과 같은 단어를 사용하여 리딩을 뭉뚱그리지 마세요.
      - **NO "MIJI"**: 닉네임이 없을 경우 "미지님"이라고 부르지 마세요. "당신"이라고 부르거나 주어를 생략하여 자연스럽게 서술하세요.
      - **USE EMOJIS**: 각 문단의 시작이나 중요한 포인트 앞에 적절한 이모티콘(✨, 🔮, 🍀, 🌟 등)을 사용하여 시각적으로 풍부하고 따뜻한 느낌을 주세요.
      - **NO COLONS**: 소제목과 본문 사이에 콜론(:)을 사용하지 마세요. (예: [소제목] 본문...)
      - **NO ABBREVIATIONS**: MBTI 인지 기능 설명 시 영어 약어(Ni, Te 등)를 절대 쓰지 마세요.
      - **NO REDUNDANCY**: "${userTitle}", "${userTitle}의"와 같은 주어의 중복 사용을 피하고 문장을 자연스럽게 연결하세요.
      - **NATURAL EMPHASIS**: 중요한 통찰은 자연스러운 문장 흐름 속에서 표현하세요. 기계적인 강조보다는 감성적인 어휘 선택으로 독자의 마음에 닿게 하세요.

      ### 📐 Output Format (Markdown) - STRICT STRUCTURE
      각 섹션은 반드시 아래의 헤더(###)로 구분해야 합니다. 제목의 양옆에 동일한 이모티콘을 배치하세요.

      ### 🗝️ 핵심 키워드 🗝️
      (이 리딩을 관통하는 3~4개의 핵심 단어를 쉼표로 구분하여 나열하세요. 예: 새로운 시작, 냉철한 판단, 내면의 치유)

      ### 📜 타로카드 심층 풀이 📜
      (각 카드와 ${userTitle}의 상황을 연결하여 3~4문단의 깊이 있는 분석을 서술하세요. 카드의 상징이 ${mbti ? `${mbti}의 성향` : "심리적 상태"}과 어떻게 상호작용하는지 구체적으로 묘사하세요. 단순한 카드 해석을 넘어 한 편의 스토리텔링처럼 이어지도록 작성하세요.)

      ${mbti ? `
      ### 🧠 ${mbti} 심층 심리 전략 🧠
      (심리학 전문 용어인 '주기능', '부기능', '열등기능' 등을 직접 언급하지 마세요. 대신 ${userTitle}의 핵심 기질을 어떻게 전략적으로 활용하고 어떤 점을 경계해야 할지 한 편의 조언처럼 매끄럽게 서술하세요.)
      *   ✨ [가장 먼저 신뢰해야 할 내면의 강력한 힘] (주기능을 바탕으로, 현재 상황에서 이 강점을 어떻게 행동으로 옮길지 조언)
      *   🌿 [균형을 잡아줄 보조적인 지혜와 기술] (부기능을 바탕으로, 결과를 더 유리하게 만들기 위해 보조적으로 활용할 방법 제안)
      *   ⚠️ [판단이 흐려질 때 되새겨야 할 점] (3차기능의 특성을 고려하여, 판단 착오를 방지할 수 있는 구체적인 마음가짐 조언)
      *   🛡️ [위기 속에서도 평정심을 유지하는 열쇠] (열등기능을 세밀하게 다스려 위기를 극복하는 방법 지시)` : ''}

      ### 💡 현실적인 조언 💡
      (추상적인 조언 대신, 당장 다음 주부터 실천할 수 있는 구체적인 행동 지침 3가지를 제안하세요.)
      *   🗣️ [대인관계/소통]: ...
      *   💼 [일/학업]: ...
      *   🧘 [마음가짐]: ...

      ### 🍀 행운의 요소 🍀
      (이 운세를 더욱 빛나게 해줄 행운의 아이템들을 구체적으로 추천하세요.)
      *   🎨 [행운의 색상]: (구체적인 컬러명과 이유)
      *   📍 [행운의 장소]: (에너지를 얻을 수 있는 구체적 장소)
      *   🔢 [행운의 숫자]: (1~45 사이 2개)
      *   ⏰ [추천 시간]: (하루 중 가장 에너지가 좋은 시간대)

      ### 🌟 마치는 글 🌟
      ${userTitle}의 앞날을 진심으로 응원하고 축복하는 따뜻한 격려의 메시지를 먼저 작성하세요. (예: "당신의 열정과 노력은 결실을 맺을 것입니다...")

      > "${userTitle}의 오늘을 빛낼 한 문장의 명언" - 인물 이름
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: `당신은 인간의 심리와 우주의 상징을 연결하는 고도의 타로 상담가입니다. 당신의 언어는 깊이가 있으며, ${userTitle}에게 단순한 예언이 아닌 성장을 위한 영감을 줍니다.`,
        temperature: 0.8,
      }
    });

    return response.text || "별들의 목소리가 희미합니다. 다시 시도해 주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockReading(question, cards, mbti, getMoonData(), readingTypeName, nickname);
  }
};

const getMockReading = (question: string, cards: SelectedCard[], mbti: string | undefined, moonData: any, readingTypeName: string, nickname?: string): string => {
  const userTitle = nickname ? `${nickname}님` : "당신";
  const isLotto = readingTypeName === "로또운";

  const closingMessage = isLotto
    ? `### 🌟 마치는 글\n이 결과는 재미로만 즐겨주세요. 타로가 전하는 행운도 중요하지만, ${userTitle}의 삶을 위해 오늘 하루도 더 열심히 노력하고 나아가는 자세가 결국 가장 큰 행운을 불러온다는 점을 잊지 마세요! ${userTitle}의 모든 노력이 큰 결실로 이어지길 응원합니다.`
    : `### 🌟 마치는 글\n리딩을 맺으며 ${userTitle}의 앞날을 진심으로 응원하고 축복하는 따뜻한 격려를 전합니다.`;

  return `### 🔮 ${readingTypeName} 총평(체험판 모드)
API 키가 설정되지 않아 체험판 모드로 결과를 보여드립니다.${moonData.phaseKo}의 에너지가 이 리딩에 깃들어 있습니다.${userTitle}이 선택한 카드들은 ${readingTypeName}의 흐름 속에서 조화로운 메시지를 전하고 있습니다.

${isLotto ? `*   **행운의 가이드**: 동쪽 방향, 7일, 오후 3시, 금색, 탁 트인 공원을 주목해 보세요.` : ''}

### 🃏 상세 카드 풀이
${cards.map(c => `*   **${c.position}**\n    이 카드는 ${userTitle}의 ${c.position}에서 나타나는 중요한 상징입니다. ${c.isReversed ? c.meaningRev : c.meaningUp}의 의미를 되새겨보세요.`).join('\n')}

${mbti ? `### 🧠 ${mbti} 심층 분석
*   **${userTitle}의 타고난 직관을 활용하는 ${userTitle}의 강점은** 상황의 본질을 꿰뚫어 보는 통찰력에 있습니다.
*   **주변 사람들을 배려하는 ${userTitle}의 장점은** 따뜻한 조화를 만들어내는 능력입니다.
*   **현실적인 디테일을 챙겨야 하는 ${userTitle}의 고려사항은** 때로는 숲보다 나무를 먼저 봐야 할 때도 있다는 점입니다.
*   **가끔은 너무 많은 생각에 잠기는 ${userTitle}의 아킬레스건은** 행동하기 전에 망설이게 만들 수 있으니, 과감한 결단이 필요합니다.` : ''
    }

### ✨ 실천적 조언
  *   ** API 키 설정하기:** 정식 버전을 이용하시려면 \`.env.local\` 파일에 올바른 Gemini API 키를 입력해주세요.
*   **내면의 목소리 듣기:** 잠시 눈을 감고 명상하는 시간을 가져보세요. 해답은 이미 ${userTitle} 안에 있습니다.

${closingMessage}

> "${userTitle}의 오늘을 빛낼 한 문장의 명언" - 타로 마스터
`;
};