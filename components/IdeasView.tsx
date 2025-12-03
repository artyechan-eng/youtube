import React from 'react';
import { VideoIdea } from '../types';
import { Lightbulb, Trophy, Users, Star } from 'lucide-react';

interface Props {
  ideas: VideoIdea[];
  onSelect: (idea: VideoIdea) => void;
  isLoading: boolean;
}

export const IdeasView: React.FC<Props> = ({ ideas, onSelect, isLoading }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">기획 제안</h2>
        <p className="text-slate-400">분석된 성공 공식을 대입한 새로운 주제들입니다. 하나를 선택하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea, index) => (
          <div 
            key={index}
            onClick={() => !isLoading && onSelect(idea)}
            className={`
                group cursor-pointer relative bg-slate-900 border border-slate-700 rounded-2xl p-6 transition-all duration-300
                hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg">
                    <Lightbulb size={24} />
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                    <Trophy size={12} />
                    Score: {idea.predictedViralScore}
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                {idea.title}
            </h3>
            
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                {idea.premise}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
                <Users size={14} />
                <span>타겟: {idea.targetAudience}</span>
            </div>
          </div>
        ))}
      </div>

        {isLoading && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Star className="text-indigo-500 animate-pulse" size={20} />
                    </div>
                </div>
                <p className="text-indigo-300 font-medium animate-pulse">선택하신 주제로 대본을 쓰고 있습니다...</p>
            </div>
        )}
    </div>
  );
};