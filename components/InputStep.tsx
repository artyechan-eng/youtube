import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const InputStep: React.FC<Props> = ({ value, onChange, onAnalyze, isAnalyzing }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
          인기 동영상의 DNA를 훔치세요
        </h2>
        <p className="text-slate-400">
          벤치마킹하고 싶은 유튜브 영상의 대본(스크립트)을 붙여넣으세요. <br/>
          AI가 성공 요인을 분석하고 새로운 기획을 제안합니다.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="여기에 대본을 붙여넣으세요... (예: 안녕하세요, 오늘은 제가...)"
          className="relative block w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg leading-relaxed shadow-xl"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || isAnalyzing}
          className={`
            relative flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105
            ${!value.trim() || isAnalyzing 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]'}
          `}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              분석 중...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-purple-600" />
              분석 시작하기
            </>
          )}
        </button>
      </div>
    </div>
  );
};