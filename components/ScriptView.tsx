import React, { useState } from 'react';
import { GeneratedScript, VideoIdea } from '../types';
import { Copy, Check, Download, RefreshCw, Edit3, Lightbulb } from 'lucide-react';

interface Props {
  script: GeneratedScript;
  onReset: () => void;
  ideas: VideoIdea[];
  selectedIdea: VideoIdea;
  onSelectIdea: (idea: VideoIdea) => void;
  isGenerating: boolean;
}

export const ScriptView: React.FC<Props> = ({ script, onReset, ideas, selectedIdea, onSelectIdea, isGenerating }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = script.sections.map(s => `[${s.heading}]\n(화면: ${s.visualCue})\n${s.content}\n`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = script.sections.map(s => `### ${s.heading}\n**Visual:** ${s.visualCue}\n\n${s.content}\n`).join('\n---\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, '_')}_script.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-[calc(100vh-100px)] flex gap-6 animate-fade-in">
      {/* Left Sidebar - Ideas */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-500" />
            다른 기획안
          </h3>
          <div className="space-y-2">
            {ideas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => !isGenerating && onSelectIdea(idea)}
                disabled={isGenerating}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedIdea.title === idea.title
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-sm font-medium line-clamp-2 mb-1">{idea.title}</div>
                <div className="text-xs opacity-75 flex items-center justify-between">
                  <span>{idea.targetAudience}</span>
                  <span className="font-bold">🔥 {idea.predictedViralScore}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw size={18} />
          처음으로
        </button>
      </div>

      {/* Main Content - Script */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 shrink-0">
          <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-1">완성된 대본</h2>
              <p className="text-indigo-400 font-medium truncate">{script.title}</p>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              {copied ? '복사됨' : '복사'}
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
            >
              <Download size={18} />
              저장
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">
        {script.sections.map((section, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {section.heading}
                </span>
                <span className="text-xs text-slate-600">Section {idx + 1}</span>
            </div>
            
            <div className="mb-4 bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <span className="flex items-center gap-2 text-xs font-bold text-pink-500 mb-1">
                    <Edit3 size={12} /> 화면 연출 (Visual Cue)
                </span>
                <p className="text-slate-400 text-sm italic">{section.visualCue}</p>
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-loose text-slate-100 whitespace-pre-line font-medium">
                    {section.content}
                </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};