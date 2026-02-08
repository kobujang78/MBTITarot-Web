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
    const freeKey = import.meta.env.VITE_GEMINI_API_KEY_FREE;
    const paidKey = import.meta.env.VITE_GEMINI_API_KEY_PAID;
    const fallbackKey = import.meta.env.VITE_GEMINI_API_KEY; // 기존 키 하위 호환성 유지

    const apiKeys = [freeKey, paidKey, fallbackKey].filter(k => k && !k.includes('PLACEHOLDER'));

    // Use nickname if available. If NOT, use natural pronouns or omission strategies.
    // Forbidden words: "미지님", "공통"
    const userTitle = nickname ? `${nickname}님` : "당신";

    // Check for valid API Keys
    if (apiKeys.length === 0) {
      console.warn("Using Mock Response due to missing/invalid API Key");
      return getMockReading(question, cards, mbti, moonData, readingTypeName, nickname);
    }

    let lastError = null;

    // API 키 순회하며 시도 (Free -> Paid -> Legacy)
    for (const apiKey of apiKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const specificGuidelines = {
          // 1. 일상 & 주기
          "오늘의운세": `
            * **집중 포인트**: 하루의 전체적인 '에너지 톤앤매너'와 시간대별 유의사항.
            * **상세 지침**: 아침, 점심, 저녁의 흐름을 카드의 원소(물, 불, 공기, 흙)와 연결하세요. 오늘 하루 특히 조심해야 할 '감정의 덫'을 MBTI 기질과 연결해 경고하세요.`,

          "로또운": `
            * **집중 포인트**: 직관의 증폭과 외부의 횡재수.
            * **상세 지침**: 카드의 숫자나 상징물(동전 개수, 인물 수 등)을 조합하여 행운의 팁을 만드세요. "돈을 쫓기보다 행운이 머물게 하는 공간의 기운"을 풍수적으로 조언하세요.
            * **행운의 요소**: 리딩 본문 어딘가에 카드의 상징을 바탕으로 한 **[행운의 방향, 추천 일자, 추천 시간대, 행운의 색상, 행운의 장소]**를 구체적인 팁처럼 자연스럽게 포함하세요.
            * **마치는 글**: "이 결과는 재미로만 즐겨주세요"라는 멘트와 함께, "결과와 상관없이 ${userTitle}의 노력과 나아가는 자세가 밝은 미래를 만듭니다"라는 메시지로 마무리하세요.`,

          "신년운세": `
            * **집중 포인트**: 2026년 병오년(丙오年)의 '붉은 말' 기운과 사용자 카드의 조화.
            * **상세 지침**: 분기별(1~4분기) 핵심 키워드를 도출하세요. 올해 반드시 매듭지어야 할 '과거의 업보'와 새로 시작할 '운명의 씨앗'을 대조하여 서술하세요.
            * **주의**: 리딩 본문에서 연도를 언급할 때는 반드시 **2026년** 또는 **병오년(丙午年)**으로 지칭하세요.`,

          // 2. 사랑 & 관계
          "솔로탈출": `
            * **집중 포인트**: 새로운 인연의 특징과 내가 고수해야 할 매력 전략.
            * **상세 지침**: 다가올 인연의 외모적 분위기나 직업적 성향을 카드 상징에서 유추하세요. MBTI 특성상 인연을 놓치기 쉬운 '방어 기제'를 어떻게 깰지 조언하세요.`,

          "연애운": `
            * **집중 포인트**: 현재 파트너와의 에너지 싱크로율과 갈등의 실체.
            * **상세 지침**: 상대방의 카드 위치에서 느껴지는 무의식적 요구를 읽어내세요. 권태기인지 성숙기인지 진단하고, 관계의 온도를 높일 수 있는 구체적인 데이트 방식이나 대화법을 제안하세요.`,

          "재회운": `
            * **집중 포인트**: 끊어진 에너지의 연결 고리 유무와 '먼저 연락해도 될지' 여부.
            * **상세 지침**: 카드가 '미련'인지 '진심'인지 냉정하게 분석하세요. 재회했을 때 반복될 문제점을 MBTI 궁합 관점에서 지적하고, 기다림이 약이 될지 독이 될지 명확히 선을 그어주세요.`,

          // 3. 자산 & 투자
          "투자운": `
            * **집중 포인트**: 공격적 확장 vs 방어적 유지의 타이밍.
            * **상세 지침**: 카드의 수비학적 의미를 현재 자산 상황에 대입하세요. 주변의 정보(공기 원소)에 휘둘리는지, 본인의 고집(흙 원소)에 갇혀 있는지 판단하여 투자 포트폴리오의 심리적 방향을 제시하세요.`,

          "주식운": `
            * **집중 포인트**: 변동성에 대응하는 멘탈 관리와 매매 포지션.
            * **상세 지침**: 캔들 차트의 형상과 카드의 이미지를 연결하여 리딩하세요. '추격 매수'의 위험이나 '손절'의 필요성을 카드의 단호한 상징(검, 탑 등)과 연결해 강하게 조언하세요.`,

          "부동산": `
            * **집중 포인트**: 터의 기운, 계약의 안전성, 장기적 보유 가치.
            * **상세 지침**: 카드가 보여주는 '공간의 안정감'을 분석하세요. 서류상의 문제(검)나 이동의 기운(전차)이 있는지 확인하고, 실거주와 투자 중 어느 쪽에 에너지가 쏠려 있는지 리딩하세요.`,

          // 4. 비즈니스 & 사회
          "취업운": `
            * **집중 포인트**: 합격의 기운이 강한 조직의 성격과 면접 필승 전략.
            * **상세 지침**: 사용자 MBTI가 해당 조직(카드에서 보이는 분위기)에서 '빌런'이 될지 '에이스'가 될지 분석하세요. 합격 확률을 높이는 첫인상과 강조해야 할 핵심 역량을 제안하세요.`,

          "사업운": `
            * **집중 포인트**: 현금 흐름의 막힘 해소와 확장 시기.
            * **상세 지침**: 리더로서의 고독함(은둔자)이나 확장세(완드)를 진단하세요. 현재 가장 주의해야 할 내부 직원 혹은 파트너의 유형을 카드 인물화 속에서 찾아 묘사하세요.`,

          "대인관계": `
            * **집중 포인트**: 주변 사람들과의 에너지 조화와 '손절'해야 할 인연.
            * **상세 지침**: 내가 주는 에너지에 비해 받는 에너지가 적은지(불균형) 확인하세요. 사회적 가면(페르소나)과 실제 자아 사이의 괴리를 MBTI 기능과 연결하여 인간관계 피로도를 낮추는 법을 조언하세요.`,
        };

        const readingSpecificGuideline = specificGuidelines[readingTypeName as keyof typeof specificGuidelines] || "전반적인 흐름을 리딩하세요.";
        const isNewYear = readingTypeName === "신년운세";

        const prompt = `
          ### 🎭 Persona & Role
          당신은 현대 심리학(MBTI)과 고대 점술(타로, 점성술)을 결합하여 인간의 내면을 꿰뚫어 보는 '미스틱 타로 마스터'입니다. 
          ${userTitle}의 고민을 단순히 해결하는 것을 넘어, 성격적 특성과 우주의 에너지를 연결하여 영혼의 성장을 돕는 깊이 있는 통찰을 제공합니다.

          ### � ${readingTypeName} 특화 심층 분석 지침
          ${readingSpecificGuideline}
          
          [중요]: 위 지침은 이번 리딩의 가장 핵심적인 '관점'입니다. 
          사용자가 궁금해하는 실질적인 답변(예: 재회 가능성, 매도 타이밍 등)을 회피하지 말고 카드를 근거로 명확히 제시하세요.
          
          ### �🌌 Reading Context
          *   **현재 날짜**: ${new Date().toLocaleDateString('ko-KR')}
          *   **질문**: "${question || (isNewYear ? "2026년 신년운세" : "전반적인 운세의 흐름")}"
          *   **리딩 유형**: ${readingTypeName}
          *   **사용자 성향(MBTI)**: ${mbti || "미지 (일반적인 상징으로 해석)"}
          *   **사용자 닉네임**: ${nickname || "미지"}
          *   **현재의 달 (위상)**: ${moonData.phaseKo} (${moonData.influence})

          ### 🃏 The Spread (Selected Cards)
          ${cards.map(c => `
          [${c.position}] - ${c.nameKo} (${c.name})
          - 방향: ${c.isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
          - 상징: "${c.isReversed ? c.meaningRev : c.meaningUp}"`).join('')}

          ### 🎯 심화 리딩 전략 (Advanced Synergy)

          1. **MBTI 인지 기능의 형상화**: 
             - 사용자의 MBTI를 단순 성격으로 치부하지 마세요. 
             - **[에너지의 방향(E/I), 정보 수집(S/N), 의사결정(T/F), 생활 양식(J/P)]**이 선택된 카드의 '원소'나 '인물'과 어떻게 충돌하거나 결합하는지 묘사하세요. 
             - 예: "세심한 현실 감각(S)을 가진 당신에게 이 카드의 구체적인 금전적 상징은 실질적인 기회로 다가올 것입니다." (인지 기능 명칭을 직접 언급하지 말고 그 성질을 풀어 쓰세요.)

          2. **달의 위상을 서사적 형용사로 활용**: 
             - ${moonData.phaseKo}를 리딩의 배경 음악처럼 사용하세요. 
             - **초승달/상현달**: "무언가 솟구치는 기운", "성급함을 경계해야 할 때"
             - **보름달**: "모든 것이 드러나는 명백함", "감정의 과잉을 다스려야 할 정점"
             - **하현달/그믐달**: "정리와 비움의 미학", "수면 아래에서 준비되는 보이지 않는 힘"
             - 단순히 상태를 알리지 말고, 이 에너지가 카드 해석의 '속도'나 '강도'를 어떻게 조절하는지 리딩에 녹여내세요.

          3. **비인칭 서술 기법 (Zero-Pronoun Strategy)**:
             - ${!nickname ? `닉네임이 없을 경우, "당신"이라는 단어마저 80% 이상 제거하세요.` : `사용자를 지칭할 때는 항상 "${userTitle}"이라는 표현을 사용하세요.`} 
             - "~하는 흐름이 감지됩니다", "~할 가능성이 높게 점쳐집니다", "이 카드는 ~라는 메시지를 던지고 있습니다"와 같이 **운명 그 자체를 주어**로 삼아 신비로움을 극대화하세요.

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
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: `당신은 인간의 심리와 우주의 상징을 연결하는 고도의 타로 상담가입니다. 당신의 언어는 깊이가 있으며, ${userTitle}에게 단순한 예언이 아닌 성장을 위한 영감을 줍니다.`,
            temperature: 0.8,
          }
        });

        if (response.text) {
          return response.text;
        }
      } catch (error: any) {
        console.error(`Gemini API Key (${apiKey.substring(0, 5)}...) Failed:`, error);
        lastError = error;
        // 429(Quota) 또는 404/403 등 특정 에러 발생 시 다음 키로 시도
        continue;
      }
    }
  } catch (error) {
    console.error("Critical Gemini Service Error:", error);
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