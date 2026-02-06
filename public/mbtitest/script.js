// Game State
let currentQuestion = 0;
let answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let selectedAnswer = null;
let mbtiResult = '';

// 20 MBTI Questions
const questions = [
    {
        text: "파티에 갔을 때, 당신은 보통 어떻게 행동하나요?", answers: [
            { text: "다양한 사람들과 어울리며 대화한다", type: "E", score: 2 },
            { text: "소수의 사람들과 깊은 대화를 나눈다", type: "I", score: 2 },
            { text: "조용한 구석에서 사람들을 관찰한다", type: "I", score: 1 },
            { text: "상황에 따라 다르다", type: "E", score: 0 }
        ]
    },
    {
        text: "새로운 프로젝트를 시작할 때, 당신은?", answers: [
            { text: "전체적인 비전과 가능성을 먼저 생각한다", type: "N", score: 2 },
            { text: "구체적인 계획과 단계를 세운다", type: "S", score: 2 },
            { text: "과거 경험을 바탕으로 접근한다", type: "S", score: 1 },
            { text: "즉흥적으로 시작한다", type: "P", score: 1 }
        ]
    },
    {
        text: "친구가 고민을 털어놓을 때, 당신은?", answers: [
            { text: "해결책을 제시한다", type: "T", score: 2 },
            { text: "공감하며 위로한다", type: "F", score: 2 },
            { text: "비슷한 경험을 공유한다", type: "F", score: 1 },
            { text: "조용히 들어준다", type: "I", score: 1 }
        ]
    },
    {
        text: "주말 계획을 세울 때, 당신은?", answers: [
            { text: "미리 상세하게 계획한다", type: "J", score: 2 },
            { text: "대략적인 계획만 세운다", type: "P", score: 1 },
            { text: "그때그때 결정한다", type: "P", score: 2 },
            { text: "다른 사람의 계획에 맞춘다", type: "F", score: 1 }
        ]
    },
    {
        text: "일할 때 당신은 어떤 방식을 선호하나요?", answers: [
            { text: "혼자 집중해서 일한다", type: "I", score: 2 },
            { text: "팀과 협력하며 일한다", type: "E", score: 2 },
            { text: "상황에 따라 유연하게", type: "P", score: 1 },
            { text: "체계적으로 단계별로", type: "J", score: 1 }
        ]
    },
    {
        text: "결정을 내릴 때, 당신은 주로?", answers: [
            { text: "논리와 분석을 중시한다", type: "T", score: 2 },
            { text: "감정과 가치를 중시한다", type: "F", score: 2 },
            { text: "직관을 따른다", type: "N", score: 1 },
            { text: "경험을 바탕으로 한다", type: "S", score: 1 }
        ]
    },
    {
        text: "새로운 사람을 만날 때, 당신은?", answers: [
            { text: "먼저 말을 건다", type: "E", score: 2 },
            { text: "상대방이 말을 걸기를 기다린다", type: "I", score: 2 },
            { text: "편안해지면 말한다", type: "I", score: 1 },
            { text: "상황에 따라 다르다", type: "E", score: 0 }
        ]
    },
    {
        text: "정보를 받아들일 때, 당신은?", answers: [
            { text: "구체적인 사실과 세부사항에 주목한다", type: "S", score: 2 },
            { text: "전체적인 패턴과 의미를 찾는다", type: "N", score: 2 },
            { text: "실용적인 활용방안을 생각한다", type: "S", score: 1 },
            { text: "새로운 가능성을 상상한다", type: "N", score: 1 }
        ]
    },
    {
        text: "갈등 상황에서 당신은?", answers: [
            { text: "객관적으로 문제를 분석한다", type: "T", score: 2 },
            { text: "관계와 감정을 우선 고려한다", type: "F", score: 2 },
            { text: "공정한 해결책을 찾는다", type: "T", score: 1 },
            { text: "조화로운 해결을 추구한다", type: "F", score: 1 }
        ]
    },
    {
        text: "업무를 처리할 때, 당신은?", answers: [
            { text: "마감일 전에 미리 끝낸다", type: "J", score: 2 },
            { text: "마감일에 맞춰 끝낸다", type: "P", score: 1 },
            { text: "압박감 속에서 더 잘한다", type: "P", score: 2 },
            { text: "계획대로 진행한다", type: "J", score: 1 }
        ]
    },
    {
        text: "에너지를 얻는 방법은?", answers: [
            { text: "사람들과 어울리기", type: "E", score: 2 },
            { text: "혼자만의 시간", type: "I", score: 2 },
            { text: "새로운 활동", type: "E", score: 1 },
            { text: "익숙한 환경", type: "I", score: 1 }
        ]
    },
    {
        text: "책을 읽을 때, 당신은?", answers: [
            { text: "실용서나 사실 기반 책을 선호", type: "S", score: 2 },
            { text: "소설이나 철학서를 선호", type: "N", score: 2 },
            { text: "자기계발서를 선호", type: "J", score: 1 },
            { text: "다양한 장르를 읽음", type: "P", score: 1 }
        ]
    },
    {
        text: "비판을 받을 때, 당신은?", answers: [
            { text: "객관적으로 받아들인다", type: "T", score: 2 },
            { text: "감정적으로 상처받는다", type: "F", score: 2 },
            { text: "개선점을 찾는다", type: "T", score: 1 },
            { text: "관계에 미칠 영향을 걱정한다", type: "F", score: 1 }
        ]
    },
    {
        text: "여행 계획을 세울 때?", answers: [
            { text: "모든 일정을 상세히 계획", type: "J", score: 2 },
            { text: "큰 틀만 정하고 자유롭게", type: "P", score: 2 },
            { text: "현지에서 즉흥적으로", type: "P", score: 1 },
            { text: "필수 일정만 정함", type: "J", score: 1 }
        ]
    },
    {
        text: "모임에서 당신의 역할은?", answers: [
            { text: "분위기를 주도한다", type: "E", score: 2 },
            { text: "조용히 참여한다", type: "I", score: 2 },
            { text: "필요할 때 의견을 낸다", type: "I", score: 1 },
            { text: "사람들을 연결한다", type: "E", score: 1 }
        ]
    },
    {
        text: "문제 해결 시, 당신은?", answers: [
            { text: "검증된 방법을 사용", type: "S", score: 2 },
            { text: "창의적인 방법을 시도", type: "N", score: 2 },
            { text: "단계별로 접근", type: "J", score: 1 },
            { text: "여러 방법을 실험", type: "P", score: 1 }
        ]
    },
    {
        text: "의사결정의 기준은?", answers: [
            { text: "효율성과 논리", type: "T", score: 2 },
            { text: "사람과 가치", type: "F", score: 2 },
            { text: "데이터와 분석", type: "T", score: 1 },
            { text: "영향받는 사람들", type: "F", score: 1 }
        ]
    },
    {
        text: "작업 환경 선호는?", answers: [
            { text: "정리정돈된 공간", type: "J", score: 2 },
            { text: "자유로운 공간", type: "P", score: 2 },
            { text: "조용한 공간", type: "I", score: 1 },
            { text: "활기찬 공간", type: "E", score: 1 }
        ]
    },
    {
        text: "스트레스 해소법은?", answers: [
            { text: "친구들과 만남", type: "E", score: 2 },
            { text: "혼자 휴식", type: "I", score: 2 },
            { text: "운동이나 활동", type: "S", score: 1 },
            { text: "명상이나 사색", type: "N", score: 1 }
        ]
    },
    {
        text: "미래에 대해 생각할 때?", answers: [
            { text: "구체적인 목표를 세운다", type: "S", score: 1 },
            { text: "큰 꿈을 상상한다", type: "N", score: 2 },
            { text: "계획을 수립한다", type: "J", score: 1 },
            { text: "가능성을 열어둔다", type: "P", score: 1 }
        ]
    }
];

// MBTI Data
const mbtiData = {
    INTJ: {
        subtitle: "용의주도한 전략가",
        desc: "INTJ는 상상력이 풍부하면서도 결단력이 있으며, 야망이 있지만 대외적으로는 비공개적인 독창적인 성격입니다. 이들은 호기심이 많지만 쓸데없는 에너지 낭비를 싫어하는, 이 세상에서 가장 독립적이고 단호한 유형 중 하나입니다.",
        detailDesc: "INTJ는 일명 '전략가'로, 전체 인구의 2%에 불과한 희귀한 유형입니다. 이들은 풍부한 지적 호기심을 바탕으로 인생을 거대한 체스판처럼 대하며, 지성, 논리, 그리고 파격적인 의지력을 활용하여 완벽함을 추구합니다. 규칙이나 관습, 전통을 맹목적으로 따르는 것을 거부하며, 자신만의 독창적인 아이디어와 냉철한 분석력을 통해 더 효율적인 시스템을 설계하는 데 탁월합니다. 감정에 휘둘리기보다는 합리적인 근거를 최우선으로 여기기 때문에 때로는 차갑다는 오해를 받기도 하지만, 자신이 아끼는 사람과 목표에는 누구보다 깊은 헌신을 보여줍니다.",
        strengths: ["전략적 기획력", "독립적인 사고", "높은 결단력", "개방적인 태도", "시스템 분석력", "목표 지향적"],
        weaknesses: ["오만함", "지나친 완벽주의", "복잡한 감정 표현 서툼", "비판적 태도", "엄격한 기준"],
        famous: [
            { name: "일론 머스크", role: "테슬라 CEO" },
            { name: "마크 저커버그", role: "메타 CEO" },
            { name: "크리스토퍼 놀란", role: "영화감독" },
            { name: "프리드리히 니체", role: "철학자" }
        ],
        compatible: "ENFP, ENTP와 최상의 궁합을 자랑하며, 서로의 지적 호기심과 직관을 자극하여 폭발적인 시너지를 냅니다."
    },
    INTP: {
        subtitle: "논리적인 사색가",
        desc: "INTP는 평범함을 거부하고 독창적인 관점으로 세상을 바라보는 혁신가입니다. 끊임없이 생각에 잠겨 있으며, 머릿속에서는 끊임없이 논쟁과 아이디어가 오가는 지적 탐험을 즐깁니다. 조용해 보이지만 그 내면은 누구보다 열정적입니다.",
        detailDesc: "INTP는 '논리학자'로 불리며, 우주에서 가장 미스터리한 수수께끼를 푸는 것을 즐기는 유형입니다. 이들은 기존의 이론이나 사회적 통념을 그대로 받아들이지 않고, '왜?'라는 근본적인 질문을 던지며 모순을 찾아내는 데 천부적인 재능이 있습니다. 실용적인 문제 해결보다는 추상적인 개념과 이론적 가능성을 탐구하는 데 더 큰 흥미를 느끼며, 혼자만의 사색 시간을 통해 에너지를 충전합니다. 사회적 상호작용보다는 아이디어의 교류를 중요시하며, 관심 있는 분야에 대해서는 놀라운 집중력과 전문성을 발휘하여 혁신적인 발전을 이끌어냅니다.",
        strengths: ["독창적인 분석력", "풍부한 상상력", "개방적인 사고", "객관적 시각", "지적 호기심", "솔직함"],
        weaknesses: ["현실 감각 부족", "우유부단함", "정서적 공감의 어려움", "규칙 거부", "지나친 이론화"],
        famous: [
            { name: "알버트 아인슈타인", role: "물리학자" },
            { name: "빌 게이츠", role: "마이크로소프트 창업자" },
            { name: "크리스틴 스튜어트", role: "배우" },
            { name: "르네 데카르트", role: "철학자" }
        ],
        compatible: "ENTJ, ESTJ와 좋은 관계를 맺으며, INTP의 아이디어를 현실화하는 데 이들의 추진력이 큰 도움이 됩니다."
    },
    INFJ: {
        subtitle: "통찰력 있는 선지자",
        desc: "INFJ는 가장 흔치 않은 성격 유형으로, 강한 직관과 도덕적 관념을 가지고 있습니다. 이들은 단순히 꿈을 꾸는 데 그치지 않고 구체적인 계획을 세워 세상을 더 나은 곳으로 바꾸려 노력하는, 조용하지만 강력한 이상주의자입니다.",
        detailDesc: "INFJ는 '옹호자'라 불리며, 깊은 통찰력과 타인의 감정을 꿰뚫어 보는 직관력을 가진 신비로운 유형입니다. 겉으로는 조용하고 신비해 보일 수 있지만, 내면에는 인류애와 정의에 대한 뜨거운 열정이 타오르고 있습니다. 이들은 피상적인 관계보다는 영혼이 통하는 깊은 교류를 갈망하며, 타인의 성장을 돕는 것에서 삶의 의미를 찾습니다. 복잡한 문제를 창의적이고 인간 중심적으로 해결하는 능력이 뛰어나며, 자신의 신념을 위해서라면 부드럽지만 단호하게 맞설 줄 아는 외유내강의 전형입니다. 때로는 세상의 고통을 자신의 것처럼 느껴 쉽게 지치기도 합니다.",
        strengths: ["깊은 통찰력", "이타적인 헌신", "창의적인 영감", "강한 신념", "뛰어난 경청 능력", "조화 추구"],
        weaknesses: ["지나친 완벽주의", "번아웃 취약", "비판에 대한 민감성", "지나친 사생활 보호", "현실성 부족"],
        famous: [
            { name: "마틴 루터 킹", role: "인권운동가" },
            { name: "넬슨 만델라", role: "정치가" },
            { name: "괴테", role: "작가" },
            { name: "아이유", role: "가수" }
        ],
        compatible: "ENFP, ENTP와 매우 잘 맞으며, INFJ의 깊은 내면을 이해하고 지지해 줄 수 있는 활기찬 파트너가 됩니다."
    },
    INFP: {
        subtitle: "열정적인 중재자",
        desc: "INFP는 최악의 상황에서도 희망을 잃지 않고 긍정적인 가능성을 찾아내는 진정한 이상주의자입니다. 침착하고 내성적으로 보이지만, 내면에는 언제든 활활 타오를 수 있는 열정의 불꽃을 품고 있는 낭만적인 영혼의 소유자입니다.",
        detailDesc: "INFP는 '중재자'로 불리며, 자신의 가치관과 신념에 따라 삶을 살아가는 예술가적인 기질을 가지고 있습니다. 이들은 논리나 효율성보다는 자신의 심장이 시키는 일, 즉 진정성 있고 의미 있는 일에 깊이 몰두합니다. 풍부한 감수성과 상상력을 바탕으로 글, 음악, 예술 등을 통해 자신을 표현하는 것을 즐기며, 타인의 감정을 깊이 이해하고 공감하는 능력이 탁월합니다. 갈등을 싫어하고 조화를 추구하지만, 자신의 핵심 가치가 위협받을 때는 놀라울 정도로 단호해집니다. 이들은 세상에 영감을 주고, 더 따뜻한 곳으로 만드는 조용한 리더입니다.",
        strengths: ["높은 공감 능력", "풍부한 창의성", "열린 마음", "진정성 추구", "헌신적인 태도", "이상주의"],
        weaknesses: ["지나친 이상화", "현실 감각 부족", "비판에 취약", "자기 비하 경향", "결정 장애"],
        famous: [
            { name: "윌리엄 셰익스피어", role: "작가" },
            { name: "빈센트 반 고흐", role: "화가" },
            { name: "조니 뎁", role: "배우" },
            { name: "아이유", role: "가수" }
        ],
        compatible: "ENFJ, ENTJ와 잘 맞으며, INFP의 감성을 이해하면서도 현실적인 방향을 제시해 줄 수 있습니다."
    },
    ENTJ: {
        subtitle: "대담한 통솔자",
        desc: "ENTJ는 천성적인 리더로, 넘치는 카리스마와 자신감으로 공통의 목표를 향해 사람들을 이끕니다. 냉철한 이성으로 성취를 쟁취하며, 어려움이 닥쳐도 이를 성장과 승리의 기회로 삼는 불굴의 의지를 가졌습니다.",
        detailDesc: "ENTJ는 '지휘관'으로 불리며, 상상한 것을 현실로 만들어내는 강력한 추진력을 가진 유형입니다. 이들은 비효율을 혐오하고, 장기적인 안목으로 전략을 수립하여 복잡한 장애물을 체계적으로 제거해 나갑니다. 감정적인 호소보다는 논리적이고 객관적인 사실을 중시하며, 자신의 능력에 대한 확고한 믿음을 바탕으로 타인을 지휘하고 통제하는 데 능숙합니다. 때로는 냉혹하다는 평가를 받을 수도 있지만, 이는 목표 달성을 위한 최선의 길을 가고자 하는 열정의 표현입니다. 이들은 끊임없이 새로운 도전을 즐기며, 거대한 조직을 이끄는 데 탁월한 재능을 보입니다.",
        strengths: ["효율적인 리더십", "전략적 사고", "강한 의지력", "자신감", "카리스마", "에너지 넘침"],
        weaknesses: ["지나친 지배욕", "타인의 감정 무시", "오만함", "조급함", "자신의 기준 강요"],
        famous: [
            { name: "스티브 잡스", role: "애플 창업자" },
            { name: "고든 램지", role: "셰프" },
            { name: "마거릿 대처", role: "전 영국 총리" },
            { name: "짐 캐리", role: "배우" }
        ],
        compatible: "INTP, INFP와 좋은 균형을 이루며, ENTJ의 계획을 지적으로 자극하거나 정서적으로 보완해 줍니다."
    },
    ENTP: {
        subtitle: "뜨거운 논쟁을 즐기는 변론가",
        desc: "ENTP는 지적 도전을 두려워하지 않는 똑똑한 호기심형입니다. 이들은 기존의 현상에 의문을 제기하고, 반대 의견을 제시하며 활발한 정신적 운동을 즐깁니다. 규칙을 깨고 새로운 아이디어를 창조하는 진정한 혁신가입니다.",
        detailDesc: "ENTP는 '변론가'로 불리며, 풍부한 지식과 빠른 두뇌 회전을 바탕으로 끊임없이 새로운 가능성을 탐구하는 유형입니다. 이들은 논쟁 그 자체를 즐기며, 때로는 '악마의 대변인'을 자처하여 타인의 논리를 해체하고 재구성하는 과정에서 희열을 느낍니다. 반복적이고 일상적인 업무는 이들에게 지옥과도 같으며, 거시적인 안목으로 복잡한 문제를 해결하고 새로운 시스템을 구상하는 데 탁월합니다. 넘치는 에너지와 카리스마로 주변 사람들을 자신의 아이디어에 끌어들이지만, 마무리하는 끈기가 부족해 용두사미가 되는 경우도 종종 있습니다. 그러나 그들의 혁신적인 사고는 정체된 사회에 활력을 불어넣습니다.",
        strengths: ["지적 호기심", "빠른 두뇌 회전", "독창성", "뛰어난 언변", "카리스마", "적응력"],
        weaknesses: ["논쟁 유발", "감정 배려 부족", "집중력 산만", "마무리 부족", "실천력 부족"],
        famous: [
            { name: "토마스 에디슨", role: "발명가" },
            { name: "로버트 다우니 주니어", role: "배우" },
            { name: "마크 트웨인", role: "작가" },
            { name: "라이언 레이놀즈", role: "배우" }
        ],
        compatible: "INFJ, INTJ와 훌륭한 파트너가 되며, 서로의 지적 깊이와 직관을 공유하며 성장합니다."
    },
    ENFJ: {
        subtitle: "정의로운 사회운동가",
        desc: "ENFJ는 카리스마와 충만한 열정을 지닌 타고난 리더입니다. 이들은 사람들의 성장과 행복을 진심으로 바라며, 올바른 일을 위해 앞장서서 목소리를 내는 것을 두려워하지 않는 따뜻하고 영향력 있는 인물입니다.",
        detailDesc: "ENFJ는 '선도자'로 불리며, 타인에게 영감을 주고 동기를 부여하는 데 탁월한 능력을 갖춘 유형입니다. 이들은 사람을 좋아하고 깊은 공감 능력을 가지고 있어, 상대방의 잠재력을 파악하고 그것을 이끌어내는 코치 역할을 자처합니다. 언변이 뛰어나고 직관력이 좋아 집단의 분위기를 긍정적으로 이끌며, 갈등 상황에서도 모두가 납득할 만한 해결책을 찾아냅니다. 자신이 믿는 가치와 대의명분을 위해서라면 헌신적으로 노력하며, 진정성 있는 태도로 사람들의 마음을 움직입니다. 다만, 타인의 문제에 지나치게 개입하거나 비판에 상처를 잘 받는 여린 면모도 지니고 있습니다.",
        strengths: ["설득력 있는 리더십", "높은 공감 능력", "이타주의", "신뢰성", "관용", "열정"],
        weaknesses: ["지나친 이상주의", "자존감 기복", "과도한 자기희생", "결정 어려움", "타인 의식"],
        famous: [
            { name: "버락 오바마", role: "전 미국 대통령" },
            { name: "오프라 윈프리", role: "방송인" },
            { name: "제니퍼 로렌스", role: "배우" },
            { name: "존 쿠삭", role: "배우" }
        ],
        compatible: "INFP, ISFP와 잘 맞으며, ENFJ의 배려심과 상대방의 감성이 어우러져 따뜻한 관계를 형성합니다."
    },
    ENFP: {
        subtitle: "재기발랄한 활동가",
        desc: "ENFP는 자유로운 영혼의 소유자로, 매력적이고 독립적이며 에너지가 넘칩니다. 이들은 인생을 하나로 연결된 복잡하고 흥미로운 퍼즐로 보며, 그 속에서 깊은 의미와 사람들과의 진정한 연결을 찾아 헤매는 열정가입니다.",
        detailDesc: "ENFP는 '활동가'로 불리며, 전염성 있는 열정과 창의력으로 주위를 밝게 비추는 유형입니다. 이들은 순간적인 즐거움보다는 타인과의 정서적 교감과 사회적 관계에 깊은 관심을 둡니다. 뛰어난 직관력을 통해 사람들의 미묘한 감정 변화를 읽어내고, 누구와도 금방 친구가 될 수 있는 친화력을 가졌습니다. 틀에 박힌 생활을 견디기 힘들어하며, 끊임없이 새로운 아이디어와 경험을 갈구합니다. 생각이 꼬리에 꼬리를 물고 이어져 산만해 보일 수 있지만, 그들의 통찰력과 상상력은 종종 놀라운 혁신을 만들어냅니다. 진지함과 즐거움 사이를 자유롭게 오가는 매력적인 성격입니다.",
        strengths: ["풍부한 상상력", "열정적인 에너지", "뛰어난 사교성", "높은 공감력", "임기응변", "긍정적 태도"],
        weaknesses: ["집중력 부족", "지나친 생각", "감정 기복", "규칙 준수 어려움", "스트레스 취약"],
        famous: [
            { name: "로빈 윌리엄스", role: "배우" },
            { name: "RM (BTS)", role: "가수" },
            { name: "윌 스미스", role: "배우" },
            { name: "월트 디즈니", role: "창업자" }
        ],
        compatible: "INTJ, INFJ와 운명적인 궁합으로 알려져 있으며, 서로의 부족한 점을 완벽하게 보완해 줍니다."
    },
    ISTJ: {
        subtitle: "청렴결백한 논리주의자",
        desc: "ISTJ는 사실에 근거하여 사고하며, 그들의 행동이나 결정에 한 치의 의심도 사지 않는 현실주의자입니다. 책임감이 강하고 전통과 질서를 중시하며, 가정이나 직장, 사회에서 핵심적인 구성원 역할을 묵묵히 수행합니다.",
        detailDesc: "ISTJ는 '현실주의자'로 불리며, 전체 인구 중 가장 많은 비율을 차지하여 사회의 근간을 이루는 든든한 유형입니다. 이들은 모호한 추측보다는 명확한 데이터와 사실을 신뢰하며, 한 번 맡은 일은 시간이 걸리더라도 완벽하게 마무리하는 끈기를 가지고 있습니다. 체계적이고 정리 정돈된 환경을 선호하며, 규칙과 약속을 어기는 것을 극도로 싫어합니다. 감정 표현이 서툴러 차가워 보일 수 있지만, 실제로는 주변 사람들을 위해 조용히 헌신하고 보호하려는 강한 의무감을 가지고 있습니다. 변화를 두려워하지만, 안정이 보장된다면 누구보다 성실하게 조직을 지탱합니다.",
        strengths: ["정직과 성실", "강한 책임감", "침착함", "규칙 준수", "조직 관리 능력", "다재다능"],
        weaknesses: ["융통성 부족", "변화에 대한 저항", "자책하는 경향", "감정 표현의 어려움", "고집"],
        famous: [
            { name: "워렌 버핏", role: "투자자" },
            { name: "조지 워싱턴", role: "전 미국 대통령" },
            { name: "나탈리 포트만", role: "배우" },
            { name: "제프 베조스", role: "아마존 창업자" }
        ],
        compatible: "ESFP, ESTP와 잘 맞으며, ISTJ의 안정감과 이들의 활달함이 조화를 이룹니다."
    },
    ISFJ: {
        subtitle: "용감한 수호자",
        desc: "ISFJ는 소중한 사람들을 지키기 위해 헌신하는 따뜻하고 겸손한 수호자입니다. 조용하고 내성적이지만, 인간관계 기술이 뛰어나며 상황에 따라 놀라운 힘과 열정을 발휘하여 가족과 친구, 조직을 보호합니다.",
        detailDesc: "ISFJ는 '수호자'로 불리며, 진정한 이타주의와 실용적인 책임감을 겸비한 유형입니다. 이들은 타인의 생일, 기념일, 사소한 취향까지 기억할 정도로 세심한 관찰력을 가지고 있으며, 상대방이 필요로 하는 것을 말하기 전에 먼저 챙겨주는 배려심 깊은 사람들입니다. 전통과 안정을 중요시하며, 자신이 속한 집단의 조화를 깨뜨리지 않기 위해 노력합니다. 겸손한 태도로 자신의 성과를 드러내지 않으려 하지만, 맡은 바 임무는 완벽에 가깝게 수행합니다. 변화를 받아들이는 데 시간이 걸리고 갈등 상황에서 스트레스를 많이 받지만, 사랑하는 사람을 위해서라면 누구보다 강인해질 수 있습니다.",
        strengths: ["지원과 협력", "신뢰성과 인내심", "뛰어난 관찰력", "열정과 헌신", "실용적인 기술", "공감 능력"],
        weaknesses: ["지나친 겸손", "감정 억제", "변화 기피", "과도한 이타심", "비판에 대한 상처"],
        famous: [
            { name: "비욘세", role: "가수" },
            { name: "엘리자베스 2세", role: "영국 여왕" },
            { name: "앤 해서웨이", role: "배우" },
            { name: "캡틴 아메리카 (가상인물)", role: "히어로" }
        ],
        compatible: "ESFP, ESTP와 좋은 관계를 맺으며, 서로를 배려하고 현실적인 즐거움을 공유합니다."
    },
    ISTP: {
        subtitle: "만능 재주꾼",
        desc: "ISTP는 냉철한 이성주의적 성향과 왕성한 호기심을 가진 장인입니다. 이들은 직접 손으로 만지고 눈으로 확인하며 세상을 탐구하는 것을 즐기며, 예고 없이 즉흥적으로 행동하여 주변을 놀라게 하기도 합니다.",
        detailDesc: "ISTP는 '장인'으로 불리며, 도구를 다루는 데 능숙하고 기계적인 원리를 이해하는 데 탁월한 감각을 지닌 유형입니다. 이들은 복잡한 이론보다는 당장 눈앞의 문제를 해결할 수 있는 실용적인 방법에 관심이 많습니다. 평소에는 조용하고 관찰자적인 태도를 취하다가도, 필요할 때는 대담하고 신속하게 행동에 나섭니다. 위험을 감수하는 익스트림 스포츠나 기술적인 분야에 매력을 느끼며, 타인의 간섭을 극도로 싫어하는 자유로운 영혼입니다. 감정적인 공감보다는 논리적인 해결책을 제시하려 하지만, 친한 사람들에게는 툭툭 던지는 유머와 행동으로 애정을 표현합니다.",
        strengths: ["낙천적인 태도", "창의적인 문제 해결", "실용성", "위기 대처 능력", "자유로움", "손재주"],
        weaknesses: ["고집", "무뚝뚝함", "지루함을 못 견딤", "위험 감수", "공감 능력 부족"],
        famous: [
            { name: "톰 크루즈", role: "배우" },
            { name: "마이클 조던", role: "농구선수" },
            { name: "대니얼 크레이그", role: "배우" },
            { name: "베어 그릴스", role: "모험가" }
        ],
        compatible: "ESFJ, ESTJ와 잘 맞으며, ISTP의 예측 불가능함을 이들이 보완해 줄 수 있습니다."
    },
    ISFP: {
        subtitle: "호기심 많은 예술가",
        desc: "ISFP는 진정한 의미의 예술가로, 번뜩이는 영감과 풍부한 감성을 가지고 있습니다. 이들은 사회적 관습에 얽매이기보다는 자신만의 색깔로 세상을 표현하며, 매력적이고 유연한 태도로 주변 사람들의 사랑을 받습니다.",
        detailDesc: "ISFP는 '모험가'로 불리며, 삶의 매 순간을 예술 작품처럼 아름답게 만들고자 하는 유형입니다. 이들은 뛰어난 미적 감각을 지니고 있어 패션, 인테리어, 예술 분야에서 두각을 나타내는 경우가 많습니다. 말보다는 행동이나 작품으로 자신의 마음을 표현하며, 타인의 감정에 민감하게 반응하고 조화를 중요시합니다. 경쟁적인 분위기보다는 편안하고 자유로운 환경에서 능력을 발휘하며, 장기적인 계획보다는 '지금 이 순간'의 행복과 감정에 충실합니다. 겸손하고 수줍음이 많아 보이지만, 내면에는 누구보다 강렬한 열정과 자신만의 확고한 취향을 품고 있습니다.",
        strengths: ["풍부한 매력", "예술적 감각", "상상력", "호기심", "열린 마음", "배려심"],
        weaknesses: ["지나친 독립성", "예측 불가능", "스트레스 취약", "경쟁 회피", "자존감 기복"],
        famous: [
            { name: "정국 (BTS)", role: "가수" },
            { name: "마이클 잭슨", role: "가수" },
            { name: "유재석", role: "방송인" },
            { name: "브래드 피트", role: "배우" }
        ],
        compatible: "ENFJ, ESFJ, ESTJ와 잘 맞으며, ISFP의 감성을 지지해주고 현실적인 도움을 줄 수 있습니다."
    },
    ESTJ: {
        subtitle: "엄격한 관리자",
        desc: "ESTJ는 사물과 사람을 관리하는 데 타의 추종을 불허하는 뛰어난 능력을 갖춘 관리자입니다. 전통과 질서를 중시하며, 정직하고 헌신적인 태도로 옳다고 생각하는 길을 뚝심 있게 걸어가는 사회의 모범생입니다.",
        detailDesc: "ESTJ는 '경영자'로 불리며, 명확한 기준과 신념을 바탕으로 사회를 결속시키는 역할을 합니다. 이들은 훌륭한 시민의 표본으로서 법과 질서를 준수하며, 조직 내에서 체계적이고 효율적인 시스템을 구축하는 데 앞장섭니다. 모호하거나 추상적인 것보다는 확실한 사실과 결과물을 선호하며, 약속을 어기거나 게으른 태도를 용납하지 않습니다. 리더의 자리에 섰을 때 명확한 업무 지시와 공정한 평가로 조직의 목표를 달성해 냅니다. 다소 융통성이 없고 직설적인 화법으로 상처를 줄 때도 있지만, 그들의 헌신과 책임감은 그 누구보다 신뢰할 수 있습니다.",
        strengths: ["헌신과 책임감", "강한 의지", "정직함", "리더십", "질서 정연함", "현실적 판단"],
        weaknesses: ["융통성 부족", "새로운 것에 대한 거부감", "사회적 지위 집착", "감정 표현 서툼", "완고함"],
        famous: [
            { name: "손흥민", role: "축구선수" },
            { name: "미셸 오바마", role: "변호사" },
            { name: "김구라", role: "방송인" },
            { name: "헨리 포드", role: "포드 창업자" }
        ],
        compatible: "ISFP, ISTP와 좋은 궁합을 보이며, 이들의 유연함이 ESTJ의 엄격함을 부드럽게 해줍니다."
    },
    ESFJ: {
        subtitle: "사교적인 외교관",
        desc: "ESFJ는 천성적으로 사교적이며, 주위 사람들에게 끊임없는 관심과 애정을 쏟는 인기쟁이입니다. 이들은 분위기를 화기애애하게 만들고, 모두가 소외되지 않고 행복를 느낄 수 있도록 노력하는 진정한 이타주의자입니다.",
        detailDesc: "ESFJ는 '집정관'으로 불리며, 타인과의 협력과 조화를 인생의 최우선 가치로 삼는 유형입니다. 이들은 타고난 분위기 메이커로서, 모임을 주도하고 사람들을 챙기는 데서 큰 기쁨을 느낍니다. 타인의 감정을 세심하게 살피고 실질적인 도움을 주는 것을 좋아하며, 칭찬과 인정을 받을 때 에너지를 얻습니다. 전통과 예절을 중시하고 사회적 규범을 잘 따르며, 갈등 상황을 피하기 위해 자신의 의견을 굽히기도 합니다. 때로는 타인의 시선을 지나치게 의식하거나 비판에 예민하게 반응하기도 하지만, 그들의 따뜻한 마음씨는 주변을 항상 훈훈하게 만듭니다.",
        strengths: ["강한 책임감", "충성심", "따뜻한 감성", "뛰어난 사교술", "이타적인 태도", "실용적인 관리"],
        weaknesses: ["비판에 취약", "지나친 이타심", "사회적 지위 집착", "변화 거부", "의존적 성향"],
        famous: [
            { name: "테일러 스위프트", role: "가수" },
            { name: "빌 클린턴", role: "전 미국 대통령" },
            { name: "황정민", role: "배우" },
            { name: "제니퍼 로페즈", role: "가수/배우" }
        ],
        compatible: "ISFP, ISTP와 잘 맞으며, ESFJ의 보살핌이 이들에게 안정감을 줍니다."
    },
    ESTP: {
        subtitle: "모험을 즐기는 사업가",
        desc: "ESTP는 뛰어난 직관력과 에너지로 주변의 흐름을 읽고, 언제나 새로운 모험을 찾아 떠나는 활동가입니다. 이들은 이론보다는 직접 몸으로 부딪히며 배우는 것을 선호하며, 인생을 과감하고 즐겁게 즐길 줄 압니다.",
        detailDesc: "ESTP는 '사업가'로 불리며, 폭발적인 에너지와 행동력으로 무장한 유형입니다. 이들은 앉아서 토론만 하기보다는 당장 밖으로 나가 문제를 해결하는 것을 좋아합니다. 관찰력이 뛰어나 타인의 작은 변화나 태도를 기가 막히게 포착하며, 이를 활용한 협상이나 설득에 능합니다. 규칙은 깨지라고 있는 것이라 생각하며, 위험을 감수하는 스릴을 즐깁니다. 깊이 있는 감정 교류나 장기적인 계획 수립에는 약할 수 있지만, 위기 상황에서 보여주는 순발력과 대처 능력은 타의 추종을 불허합니다. 이들은 지루할 틈을 주지 않는 유쾌한 리더입니다.",
        strengths: ["대담함", "합리적이고 실용적", "독창성", "뛰어난 관찰력", "사교성", "직설적"],
        weaknesses: ["참을성 부족", "위험 감수", "규칙 미준수", "장기적 안목 부족", "감정 무시"],
        famous: [
            { name: "도널드 트럼프", role: "기업가/정치인" },
            { name: "마돈나", role: "가수" },
            { name: "전지현", role: "배우" },
            { name: "어니스트 헤밍웨이", role: "작가" }
        ],
        compatible: "ISFJ, ISTJ와 잘 맞으며, ESTP의 활력이 이들에게 새로운 자극이 됩니다."
    },
    ESFP: {
        subtitle: "자유로운 영혼의 연예인",
        desc: "ESFP는 주위에 있는 것만으로도 인생이 즐거워지는, 타고난 연예인 기질을 가진 사람입니다. 이들은 순간의 흥분과 즐거움을 무엇보다 중요하게 여기며, 관대하고 열린 마음으로 모두를 포용하는 긍정의 아이콘입니다.",
        detailDesc: "ESFP는 '연예인'으로 불리며, 스포트라이트를 받는 것을 사랑하고 세상 모든 것을 무대라고 생각하는 유형입니다. 이들은 탁월한 유머 감각과 쇼맨십으로 주변 사람들을 즐겁게 하며, 지루하고 우울한 분위기를 참지 못합니다. 미적 감각이 뛰어나 패션이나 꾸미는 것에 관심이 많고, 새로운 경험과 쾌락을 추구하는 경향이 있습니다. 복잡한 분석이나 미래에 대한 걱정보다는 '현재'를 즐기는 욜로(YOLO) 라이프를 실천합니다. 진지한 상황을 회피하려 하거나 계획성이 부족할 수 있지만, 그들의 순수한 열정과 따뜻한 위로는 친구들에게 큰 힘이 됩니다.",
        strengths: ["대담함", "독창성", "미적 감각", "실용성", "뛰어난 관찰력", "대인 관계 능력"],
        weaknesses: ["집중력 부족", "장기 계획 부재", "갈등 회피", "쉽게 지루해함", "감정적 민감성"],
        famous: [
            { name: "마릴린 먼로", role: "배우" },
            { name: "비 (정지훈)", role: "가수/배우" },
            { name: "아델", role: "가수" },
            { name: "윌 스미스", role: "배우" }
        ],
        compatible: "ISTJ, ISFJ와 잘 맞으며, ESFP의 밝은 에너지가 이들의 삶을 다채롭게 만듭니다."
    }
};

// Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    currentQuestion = 0;
    answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    selectedAnswer = null;
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question-text').textContent = q.text;
    document.getElementById('current-question').textContent = currentQuestion + 1;

    const progress = ((currentQuestion + 1) / 20) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-percent').textContent = Math.round(progress) + '%';

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    q.answers.forEach((answer, index) => {
        const btn = document.createElement('div');
        btn.className = 'answer-option';
        btn.textContent = answer.text;
        btn.onclick = () => selectAnswer(index);
        answersDiv.appendChild(btn);
    });

    selectedAnswer = null;
}

function selectAnswer(index) {
    selectedAnswer = index;
    document.querySelectorAll('.answer-option').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert('답변을 선택해주세요!');
        return;
    }

    const answer = questions[currentQuestion].answers[selectedAnswer];
    answers[answer.type] += answer.score;

    currentQuestion++;

    if (currentQuestion < 20) {
        loadQuestion();
    } else {
        calculateResult();
    }
}

function calculateResult() {
    mbtiResult = '';
    mbtiResult += answers.E > answers.I ? 'E' : 'I';
    mbtiResult += answers.S > answers.N ? 'S' : 'N';
    mbtiResult += answers.T > answers.F ? 'T' : 'F';
    mbtiResult += answers.J > answers.P ? 'J' : 'P';

    showResults();
}

function showResults() {
    const data = mbtiData[mbtiResult];
    document.getElementById('result-image').src = `images/${mbtiResult.toLowerCase()}.png`;
    // 메인 결과 화면에서는 한글 스타일명만 표시
    document.getElementById('result-subtitle').textContent = data.subtitle;
    document.getElementById('result-description').textContent = data.desc;
    showScreen('results-screen');
}

function showDetail() {
    const data = mbtiData[mbtiResult];
    document.getElementById('detail-title').textContent = mbtiResult;
    document.getElementById('detail-image').src = `images/${mbtiResult.toLowerCase()}.png`;
    document.getElementById('detail-description').textContent = data.detailDesc;

    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    data.strengths.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        strengthsList.appendChild(li);
    });

    const weaknessesList = document.getElementById('weaknesses-list');
    weaknessesList.innerHTML = '';
    data.weaknesses.forEach(w => {
        const li = document.createElement('li');
        li.textContent = w;
        weaknessesList.appendChild(li);
    });

    const famousDiv = document.getElementById('famous-people');
    famousDiv.innerHTML = '';
    data.famous.forEach(person => {
        const div = document.createElement('div');
        div.className = 'famous-person';
        div.innerHTML = `
            <div class="person-image">
                <img src="https://via.placeholder.com/100" alt="${person.name}">
            </div>
            <div class="person-name">${person.name}</div>
            <div class="person-role">${person.role}</div>
        `;
        famousDiv.appendChild(div);
    });

    document.getElementById('compatible-text').textContent = data.compatible;
    showScreen('detail-screen');
}

function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    } else {
        showScreen('start-screen');
    }
}

function restartQuiz() {
    showScreen('start-screen');
}
function shareResult() {
    const shareText = `나의 MBTI 결과: ${mbtiResult}\n${mbtiData[mbtiResult]?.subtitle || ''}\n\nMBTI 테스트 결과를 확인해보세요!`;
    const shareUrl = window.location.href;

    // Web Share API 지원 여부 확인
    if (navigator.share) {
        navigator.share({
            title: `나의 MBTI 결과: ${mbtiResult}`,
            text: shareText,
            url: shareUrl
        }).catch((error) => {
            console.log('공유 실패:', error);
            copyToClipboard(shareText, shareUrl);
        });
    } else {
        // Web Share API를 지원하지 않는 경우 클립보드에 복사
        copyToClipboard(shareText, shareUrl);
    }
}

function copyToClipboard(text, url) {
    const fullText = `${text}\n${url}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
            alert('링크가 클립보드에 복사되었습니다!\n\nSNS나 메신저에 붙여넣어 공유하세요.');
        }).catch((error) => {
            console.error('복사 실패:', error);
            fallbackCopyToClipboard(fullText);
        });
    } else {
        fallbackCopyToClipboard(fullText);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        alert('링크가 클립보드에 복사되었습니다!\n\nSNS나 메신저에 붙여넣어 공유하세요.');
    } catch (error) {
        console.error('복사 실패:', error);
        // 복사 실패 시 사용자에게 직접 표시
        const shareWindow = window.open('', '_blank', 'width=400,height=300');
        if (shareWindow) {
            shareWindow.document.write(`
                <html>
                    <head><title>공유하기</title></head>
                    <body style="padding: 20px; font-family: Arial;">
                        <h3>공유할 내용:</h3>
                        <textarea style="width: 100%; height: 150px; margin: 10px 0;">${text}</textarea>
                        <p>위 내용을 복사하여 공유하세요.</p>
                    </body>
                </html>
            `);
        } else {
            alert('공유할 내용:\n\n' + text);
        }
    }

    document.body.removeChild(textArea);
}

function closeModal() {
    showScreen('results-screen');
}

function goToSignup() {
    window.location.href = '/?signup=true';
}