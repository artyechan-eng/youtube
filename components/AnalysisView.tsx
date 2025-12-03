import React from 'react';
import { ViralAnalysis } from '../types';
import { Brain, Zap, Target, TrendingUp, Music, ArrowRight } from 'lucide-react';

interface Props {
  analysis: ViralAnalysis;
  onNext: () => void;
  isLoading: boolean;
}

export const AnalysisView: React.FC<Props> = ({ analysis, onNext, isLoading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">분석 완료: 이 영상이 떡상한 이유</h2>
        <p className="text-slate-400">AI가 추출한 성공 공식입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook Strategy */}
        <div className="bg-slate-900/50 backdrop-blur border border-pink-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={64} className="text-pink-500" />
            </div>
          <h3 className="text-pink-400 font-bold flex items-center gap-2 mb-3">
            <Zap size={18} /> 훅(Hook) 전략
          </h3>
          <p className="text-lg text-slate-200 font-medium leading-relaxed">
            "{analysis.hookStrategy}"
          </p>
        </div>

        {/* Viral Factor */}
        <div className="bg-slate-900/50 backdrop-blur border border-yellow-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={64} className="text-yellow-500" />
            </div>
          <h3 className="text-yellow-400 font-bold flex items-center gap-2 mb-3">
            <TrendingUp size={18} /> 핵심 떡상 요인
          </h3>
          <p className="text-lg text-slate-200 font-medium leading-relaxed">
            {analysis.viralFactor}
          </p>
        </div>

        {/* Retention Tactics */}
        <div className="bg-slate-900/50 backdrop-blur border border-blue-500/30 p-6 rounded-2xl md:col-span-2">
          <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-4">
            <Brain size={18} /> 시청 지속 장치 (Retention)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.retentionTactics.map((tactic, idx) => (
              <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-slate-300 text-sm">
                • {tactic}
              </div>
            ))}
          </div>
        </div>

        {/* Tone & Style */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-slate-400 font-bold flex items-center gap-2 mb-3">
            <Music size={18} /> 톤앤매너
          </h3>
          <p className="text-slate-300">{analysis.toneStyle}</p>
        </div>

        {/* Emotional Triggers */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-700 p-6 rounded-2xl">
            <h3 className="text-slate-400 font-bold flex items-center gap-2 mb-3">
                <Target size={18} /> 감정 트리거
            </h3>
            <div className="flex flex-wrap gap-2">
                {analysis.emotionalTriggers.map((trigger, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/20">
                        #{trigger}
                    </span>
                ))}
            </div>
        </div>
      </div>
      
      {/* Structure Summary */}
      <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-slate-400 font-bold mb-2 text-sm uppercase tracking-wider">구조 분석</h3>
        <p className="text-slate-300 italic">
            "{analysis.structureBreakdown}"
        </p>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-indigo-600 px-8 font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:w-56"
        >
            <span className="mr-2">다음: 아이디어 생성하기</span>
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            )}
        </button>
      </div>
    </div>
  );
};