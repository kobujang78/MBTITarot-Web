import React from 'react';
import { Sparkles } from 'lucide-react';
import { CARD_BACK_IMAGE_URL } from '../constants';

const ShuffleScreen: React.FC = () => {
  const shuffleAnims = ['animate-fluid-1', 'animate-fluid-2', 'animate-fluid-3', 'animate-fluid-4', 'animate-fluid-5', 'animate-fluid-6'];

  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] relative animate-fadeIn">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border border-slate-700 rounded-full animate-spin-slow bg-slate-800/20 backdrop-blur-sm"></div>
        <div className="absolute w-48 h-48 border border-slate-600 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="relative w-32 h-[228px] sm:w-40 sm:h-[284px] flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20">
          <img src={CARD_BACK_IMAGE_URL} className="w-full h-full object-fill opacity-100 rounded-xl" alt="deck" />
        </div>
        <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-10 rotate-2 translate-x-1 translate-y-1"></div>
        <div className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-0 -rotate-2 -translate-x-1 -translate-y-1"></div>

        {shuffleAnims.map((anim, i) => (
          <div key={i} className={`absolute inset-0 bg-slate-800 border border-slate-600 rounded-xl shadow-lg ${anim} z-30 opacity-90`} style={{ animationDelay: `${i * 0.15}s` }}>
            <img src={CARD_BACK_IMAGE_URL} className="w-full h-full object-fill opacity-100 rounded-xl" alt="flying card" />
          </div>
        ))}
      </div>

      <div className="mt-16 text-center space-y-2 relative z-40 bg-slate-900/60 px-6 py-3 rounded-xl backdrop-blur-md shadow-sm border border-slate-800">
        <h2 className="text-2xl font-serif text-slate-300 animate-pulse">운명을 섞는 중...</h2>
        <p className="text-sm text-slate-500 font-medium">카드가 당신의 기운에 반응하고 있습니다.</p>
        <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed opacity-80">잠시 눈을 감고 당신이 궁금해하는 질문을<br />마음속으로 깊이 생각해보세요.</p>
      </div>

      <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-slate-400 animate-ping opacity-50" />
      <Sparkles className="absolute bottom-1/4 right-1/4 w-4 h-4 text-slate-500 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};

export default ShuffleScreen;
