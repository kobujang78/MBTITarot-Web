export type MoonPhase = 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';

export interface MoonData {
  phase: MoonPhase;
  phaseKo: string;
  icon: string;
  influence: string;
  intensity: number; // 0 to 1 representing lunar brightness
}

export const getMoonData = (date: Date = new Date()): MoonData => {
  const cycleLength = 29.53058867;
  // Reference New Moon: Jan 6, 2000 18:14 UTC
  const reference = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
  const diff = date.getTime() - reference;
  const daysSince = diff / (1000 * 60 * 60 * 24);
  const cyclePos = daysSince % cycleLength;

  // Normalize to positive cycle position
  const age = cyclePos < 0 ? cyclePos + cycleLength : cyclePos;

  // Calculate intensity (brightness): 0 at New Moon, 1 at Full Moon
  // Full moon is approx at age 14.76
  const distFromFull = Math.abs(age - 14.765);
  // Normalize: Max distance is approx 14.76.
  // 1 - (dist / 14.76) gives 1 at Full, 0 at New.
  const intensity = Math.max(0.1, 1 - (distFromFull / 14.765));

  if (age < 1.84566) return { phase: 'New Moon', phaseKo: '신월', icon: '🌑', influence: '새로운 시작, 의도 설정의 시간', intensity };
  if (age < 5.53699) return { phase: 'Waxing Crescent', phaseKo: '초승달', icon: '🌒', influence: '성장, 구체적 계획의 시간', intensity };
  if (age < 9.22831) return { phase: 'First Quarter', phaseKo: '상현달', icon: '🌓', influence: '행동, 장애물 극복의 시간', intensity };
  if (age < 12.91963) return { phase: 'Waxing Gibbous', phaseKo: '차오르는 달', icon: '🌔', influence: '완성과 수확을 위한 준비', intensity };
  if (age < 16.61096) return { phase: 'Full Moon', phaseKo: '보름달', icon: '🌕', influence: '성취, 해방, 직관의 절정', intensity };
  if (age < 20.30228) return { phase: 'Waning Gibbous', phaseKo: '이지러지는 달', icon: '🌖', influence: '감사와 덜어내기의 시간', intensity };
  if (age < 23.99361) return { phase: 'Last Quarter', phaseKo: '하현달', icon: '🌗', influence: '용서와 내부 정리의 시간', intensity };
  return { phase: 'Waning Crescent', phaseKo: '그믐달', icon: '🌘', influence: '휴식과 치유의 시간', intensity };
};
