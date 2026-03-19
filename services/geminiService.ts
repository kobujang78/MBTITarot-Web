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
    // Use FREE key first, then PAID key
    const apiKeys = [
      import.meta.env.VITE_GEMINI_API_KEY_FREE,
      import.meta.env.VITE_GEMINI_API_KEY_PAID
    ].filter(k => k && k.startsWith('AIza') && !k.includes('YOUR_'));

    const userTitle = nickname ? `${nickname}님` : "당신";

    if (apiKeys.length === 0) {
      console.warn("No valid Gemini API keys found. Using Mock Reading.");
      return getMockReading(question, cards, mbti, moonData, readingTypeName, nickname);
    }

    let lastError: any = null;

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      const keyType = i === 0 ? "FREE" : "PAID";
      const MAX_RETRIES = 3;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`Attempting tarot reading with ${keyType} key (attempt ${attempt}/${MAX_RETRIES})...`);
          const ai = new GoogleGenAI({ apiKey: apiKey });

          // 1. 운세별 특화 페르소나 및 지침 (관점 고정)
          const specificGuidelines: Record<string, string> = {
            "오늘의운세": `[예보관 페르소나] 시간대별 바이오리듬과 '운의 날씨'를 예보하세요. 아침, 점심, 저녁의 에너지 흐름을 원소와 연결하세요.`,
            "로또운": `[풍수사 페르소나] 숫자의 기운이 머무는 장소와 찰나의 직관(N)이 번뜩이는 지점을 포착하세요. 풍수적 위치와 행운 요소를 본문에 녹이세요.`,
            "신년운세": `[예언가 페르소나] 2026년 병오년(丙午年)의 강렬한 '화(火)' 기운과 사용자의 성향이 공명하는 1년의 서사를 리딩하세요.`,
            "솔로탈출": `[중매인 페르소나] 다가올 인연의 외모적 분위기와 직업적 성향을 카드의 시각적 요소에서 구체적으로 유추하세요.`,
            "연애운": `[카운슬러 페르소나] 두 사람 사이의 '감정의 밀도'와 관계의 병목 현상을 진단하고 온도를 높일 대화법을 제안하세요.`,
            "재회운": `[심리술사 페르소나] 상대의 무의식 속에 남은 사용자의 '잔상'을 읽고, 기다림이 약일지 독이 될지 냉정히 분석하세요.`,
            "투자운": `[전략가 페르소나] 자산의 유동성과 진입 타이밍을 분석하세요. T(사고)형에겐 수치를, F(감정)형에겐 심리 제어를 강조하세요.`,
            "주식운": `[전략가 페르소나] 차트의 변동성에 대응하는 멘탈 관리와 매매 포지션을 카드의 단호한 상징과 연결해 조언하세요.`,
            "부동산": `[지관 페르소나] 터의 기운과 계약의 안전성을 '흙'과 '철'의 원소로 분석하여 장기적 가치를 논하세요.`,
            "취업운": `[헤드헌터 페르소나] 조직 문화와 사용자의 기질적 합(合)을 분석하고 면접 필승 전략과 강조할 역량을 제시하세요.`,
            "사업운": `[헤드헌터 페르소나] 현금 흐름의 막힘과 확장 시기를 진단하세요. 주의해야 할 파트너 유형을 카드에서 묘사하세요.`,
            "대인관계": `[조율사 페르소나] 에너지 도둑을 가려내고, 심리적 거리두기를 통해 내면의 평화를 지키는 기술을 전수하세요.`
          };

          // 2. 운세별 특화 목차 구성 (Output Format 가변화)
          const formatTemplates: Record<string, string> = {
            // 1. 일상 & 주기
            "오늘의운세": `### 🌤️ 오늘의 에너지 기상도 🌤️\n### ⏳ 시간대별 운세 가이드 ⏳\n### ⚠️ 오늘 문득 찾아올 주의 신호 ⚠️`,
            "로또운": `### 🎰 횡재의 기운과 풍수적 지침 🎰\n### 🃏 숫자와 상징 속에 숨은 영감 🃏\n### 🍀 행운을 부르는 찰나의 선택 🍀`,
            "신년운세": `### 📅 2026년 병오년(丙午年) 총운 📅\n### 🌊 분기별 운명의 파동과 흐름 🌊\n### 🚩 올해 반드시 성취할 운명적 과업 🚩`,

            // 2. 사랑 & 인연
            "솔로탈출": `### 👤 인연의 형상과 매력의 발현 👤\n### 📍 새로운 인연이 머무는 장소 📍\n### 🗝️ 닫힌 마음을 여는 운명의 열쇠 🗝️`,
            "연애운": `### ❤️ 두 사람의 감정 온도와 결속력 ❤️\n### 🌪️ 관계의 병목 현상과 해소법 🌪️\n### 💌 사랑의 깊이를 더할 교감의 기술 💌`,
            "재회운": `### 🕯️ 상대의 무의식에 남은 당신의 잔상 🕯️\n### ⚖️ 끊어진 인연의 무게와 재회 가능성 ⚖️\n### 💡 과거를 마주하는 현명한 마음가짐 💡`,

            // 3. 자산 & 투자
            "투자운": `### 📈 자산의 유동성과 시장의 흐름 📈\n### 🛡️ 손실을 막는 심리적 방어 기제 🛡️\n### 💰 수익을 실현할 결단의 타이밍 💰`,
            "주식운": `### 📉 차트 너머를 보는 직관의 힘 📉\n### ⚔️ 탐욕과 공포를 다스리는 전략 ⚔️\n### 🎯 매매 포지션과 최종 포트폴리오 조언 🎯`,
            "부동산": `### 🏠 터의 기운과 공간의 안정성 🏠\n### 📑 계약의 완결성과 문서의 흐름 📑\n### 💎 장기적 보유 가치와 미래 전망 💎`,

            // 4. 비즈니스 & 사회
            "취업운": `### 🏢 당신을 부르는 조직의 성격 🏢\n### 🛡️ 면접관의 마음을 꿰뚫는 필승 전략 🛡️\n### 🚀 첫 발을 내딛기 위한 핵심 역량 🚀`,
            "사업운": `### 🚩 사업의 계절과 현금 흐름의 진단 🚩\n### 👥 조력자와 경계해야 할 인물형 👥\n### 🗺️ 확장을 위한 항로와 최종 의사결정 🗺️`,
            "대인관계": `### 🤝 인간관계의 에너지 역학 조사 🤝\n### 🛡️ 소모적인 인연을 가려내는 안목 🛡️\n### 🧘 내면의 평화를 위한 심리적 거리두기 🧘`,

            "default": `### 📜 타로카드 심층 풀이 📜\n### 🧠 심층 심리 분석과 전략 🧠\n### 💡 현실적인 삶의 조언 💡`
          };

          const currentGuideline = specificGuidelines[readingTypeName] || "깊은 공감과 통찰로 마음을 어루만지는 따뜻한 카운슬링을 제공하세요.";
          const currentFormat = formatTemplates[readingTypeName] || formatTemplates["default"];

          const prompt = `
            ### 🎭 Persona & Role
            당신은 20년 경력의 명망 있는 '프리미엄 타로 마스터'이자 심리학 전문가입니다. 
            이번 리딩에서 당신은 **${currentGuideline}**를 수행하며, 사용자의 MBTI 성향을 날카롭게 파고들어 인생의 전환점을 제시합니다.

            ### 🎯 AdSense Compliance & Content Richness (CRITICAL)
            Google AdSense 승인을 위해 **'풍부하고 가치 있는 독창적 콘텐츠'**를 생성해야 합니다.
            1. **최소 분량 엄수**: 전체 답변은 반드시 **공백 제외 1,500자 이상**의 풍부한 분량으로 작성하세요. (내용이 짧으면 절대 안 됩니다)
            2. **심층적 분석**: 현상에 대한 단순 설명이 아닌, 심리학적 원인과 미래의 파급 효과를 논리적으로 서술하세요.
            3. **독창성**: 상투적인 표현(예: "좋은 일이 생길 거예요")을 지양하고, 구체적인 상황 묘사와 비유를 사용하세요.

            ### 🌌 Context & Spread
            * **질문**: "${question || readingTypeName}" | **운세 유형**: ${readingTypeName}
            * **대상 MBTI**: ${mbti || "보편적 기질"} | **현재 달 기운**: ${moonData.phaseKo}
            * **선택 카드**: ${cards.map(c => `[${c.position}: ${c.nameKo}(${c.isReversed ? '역' : '정'})]`).join(', ')}

            ### 🧠 MBTI 심층 통합 전략
            사용자의 MBTI([${mbti || "보편적 기질"}]) 유형이 가진 고유한 인지 체계와 이 카드가 만났을 때 생기는 화학 반응을 묘사하세요. 
            - 고민에 대한 접근 방식(T/F)에 따른 맞춤형 조언.
            - 에너지의 방향(E/I)과 정보 수집(S/N) 스타일에 최적화된 리스크 관리법.
            - (약어 Ni, Te 등 영어 약어는 절대 쓰지 말고, "내면의 목소리", "객관적 논리" 등으로 풀어서 설명할 것)

            ### 📐 Output Format (STRICT)
            ### 🗝️ 오늘의 운명 키워드 🗝️
            * **키워드1**: *(상세한 의미와 배경 설명)*
            * **키워드2**: *(상세한 의미와 배경 설명)*
            * **키워드3**: *(상세한 의미와 배경 설명)*

            ${currentFormat}
            *(이 섹션에서 각 카드별로 최소 300자 이상의 집요할 정도의 상세한 해석을 제공하세요)*

            ### 🍀 행운의 머티리얼 🍀
            - **행운의 색상**: (구체적인 톤 묘사)
            - **행운의 장소**: (어떤 행위를 하면 좋은지 포함)
            - **행운의 숫자**: (숫자 2개와 그 이유)
            - **행운의 시간**: (조언과 함께)

            ### 🌟 마스터의 최종 조언 🌟
            (사용자의 삶에 실질적인 변화를 일으킬 수 있는 따뜻하고 지적인 격려, 500자 이상)

            > "(운명에 어울리는 세계적인 명언 한 구절)" - (인물)
          `;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: `당신은 20~40대 여성들에게 깊은 공감과 위로를 전하는 다정하고 지적인 타로 카운슬러입니다. 사극풍 말투('~이옵니다', '~하옵니다', '~나이다' 등)나 지나치게 예스러운 표현은 절대 금지합니다. 대신 친근하고 따뜻한 언니나 믿음직한 멘토처럼 세련되고 감성적인 현대 한국어 경어체(~해요, ~합니다)를 사용하여 ${userTitle}의 마음을 포근하게 안아주세요.`,
              temperature: 0.85,
            }
          });

          if (response.text) {
            console.log(`${keyType} key reading successful (attempt ${attempt}).`);
            return response.text;
          }

          // response.text가 비어있으면 재시도
          throw new Error("Empty response from Gemini API");

        } catch (error: any) {
          lastError = error;
          const statusCode = error?.status || error?.code || 0;
          const errorMsg = error?.message || String(error);
          console.error(`${keyType} key attempt ${attempt} failed [${statusCode}]:`, errorMsg.substring(0, 200));

          // Rate limit (429) 또는 서버 에러 (500, 503) → 재시도
          const isRetryable = statusCode === 429 || statusCode === 500 || statusCode === 503
            || errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')
            || errorMsg.includes('500') || errorMsg.includes('503');

          if (isRetryable && attempt < MAX_RETRIES) {
            const waitSeconds = attempt * 5; // 5초, 10초 대기
            console.log(`Rate limited or server error. Waiting ${waitSeconds}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
            continue;
          }

          // 재시도 불가능한 에러(404 등)이면 다음 API 키로 이동
          break;
        }
      }
    }
    throw lastError;
  } catch (error) {
    console.error("Critical Gemini Service Error or all keys failed. Falling back to trial mode:", error);
    return getMockReading(question, cards, mbti, getMoonData(), readingTypeName, nickname);
  }
};

const getMockReading = (question: string, cards: SelectedCard[], mbti: string | undefined, moonData: any, readingTypeName: string, nickname?: string): string => {
  const userTitle = nickname ? `${nickname}님` : "당신";
  const isLotto = readingTypeName === "로또운";

  const closingMessage = isLotto
    ? `### 🌟 마치는 글 🌟\n이 결과는 재미로만 즐겨주세요. 타로가 전하는 행운도 중요하지만, ${userTitle}의 삶을 위해 오늘 하루도 더 열심히 노력하고 나아가는 자세가 결국 가장 큰 행운을 불러온다는 점을 잊지 마세요! ${userTitle}의 모든 노력이 큰 결실로 이어지길 응원합니다.`
    : `### 🌟 마치는 글 🌟\n리딩을 맺으며 ${userTitle}의 앞날을 진심으로 응원하고 축복하는 따뜻한 격려를 전합니다.`;

  return `### 🔮 ${readingTypeName} 총평(체험판 모드)
API 키가 설정되지 않아 체험판 모드로 결과를 보여드립니다. ${moonData.phaseKo}의 에너지가 이 리딩에 깃들어 있습니다. ${userTitle}이 선택한 카드들은 ${readingTypeName}의 흐름 속에서 조화로운 메시지를 전하고 있습니다.

${isLotto ? `*   **행운의 가이드**: 동쪽 방향, 7일, 오후 3시, 금색, 탁 트인 공원을 주목해 보세요.` : ''}

### 🃏 상세 카드 풀이
${cards.map(c => `*   **${c.position}**\n    이 카드는 ${userTitle}의 ${c.position}에서 나타나는 중요한 상징입니다. ${c.isReversed ? c.meaningRev : c.meaningUp}의 의미를 되새겨보세요.`).join('\n')}

${mbti ? `### 🧠 ${mbti} 심층 분석
*   **${userTitle}의 타고난 직관을 활용하는 강점은** 상황의 본질을 꿰뚫어 보는 통찰력에 있습니다.
*   **주변 사람들을 배려하는 장점은** 따뜻한 조화를 만들어내는 능력입니다.
*   **현실적인 디테일을 챙겨야 하는 고려사항은** 때로는 숲보다 나무를 먼저 봐야 할 때도 있다는 점입니다.
*   **가끔은 너무 많은 생각에 잠기는 아킬레스건은** 행동하기 전에 망설이게 만들 수 있으니, 과감한 결단이 필요합니다.` : ''
    }

### ✨ 실천적 조언
*   **API 키 설정하기:** 정식 버전을 이용하시려면 \`.env.local\` 파일에 올바른 Gemini API 키를 입력해주세요.
*   **내면의 목소리 듣기:** 잠시 눈을 감고 명상하는 시간을 가져보세요. 해답은 이미 ${userTitle} 안에 있습니다.

${closingMessage}

> "성공하기까지는 언제나 불가능해 보이기 마련이다." - 넬슨 만델라
`;
};