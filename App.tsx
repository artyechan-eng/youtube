import React, { useState } from 'react';
import { AppStep, ViralAnalysis, VideoIdea, GeneratedScript } from './types';
import { analyzeTranscript, generateIdeas, generateScript, setApiKey } from './services/geminiService';
import { InputStep } from './components/InputStep';
import { AnalysisView } from './components/AnalysisView';
import { IdeasView } from './components/IdeasView';
import { ScriptView } from './components/ScriptView';
import { ApiKeyManager } from './components/ApiKeyManager';
import { Clapperboard, Github } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [sourceText, setSourceText] = useState('');
  const [analysis, setAnalysis] = useState<ViralAnalysis | null>(null);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [finalScript, setFinalScript] = useState<GeneratedScript | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const result = await analyzeTranscript(sourceText);
      setAnalysis(result);
      setStep(AppStep.ANALYSIS_VIEW);
    } catch (error) {
      console.error(error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!analysis) return;
    try {
      setLoading(true);
      setStep(AppStep.GENERATING_IDEAS); // Just a loading state indicator really
      const result = await generateIdeas(analysis, sourceText);
      setIdeas(result);
      setStep(AppStep.IDEAS_VIEW);
    } catch (error) {
      console.error(error);
      alert('아이디어 생성 중 오류가 발생했습니다.');
      setStep(AppStep.ANALYSIS_VIEW);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = async (idea: VideoIdea) => {
    if (!analysis) return;
    setSelectedIdea(idea);
    try {
      setLoading(true);
      setStep(AppStep.GENERATING_SCRIPT);
      const result = await generateScript(idea, analysis);
      setFinalScript(result);
      setStep(AppStep.SCRIPT_VIEW);
    } catch (error) {
      console.error(error);
      alert('대본 작성 중 오류가 발생했습니다.');
      setStep(AppStep.IDEAS_VIEW);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdeaFromScript = async (idea: VideoIdea) => {
    if (!analysis || loading) return;
    setSelectedIdea(idea);
    try {
      setLoading(true);
      const result = await generateScript(idea, analysis);
      setFinalScript(result);
    } catch (error) {
      console.error(error);
      alert('대본 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("처음으로 돌아가시겠습니까? 현재 작업 내용은 사라집니다.")) {
      setStep(AppStep.INPUT);
      setSourceText('');
      setAnalysis(null);
      setIdeas([]);
      setSelectedIdea(null);
      setFinalScript(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => step !== AppStep.INPUT && handleReset()}>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Clapperboard size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TubeAlchemy
            </span>
          </div>
          <div className="flex items-center gap-4">
             {step !== AppStep.INPUT && (
               <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                 <span className={`px-2 py-1 rounded ${step === AppStep.ANALYSIS_VIEW ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600'}`}>1. 분석</span>
                 <span className="text-slate-700">→</span>
                 <span className={`px-2 py-1 rounded ${step === AppStep.IDEAS_VIEW ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600'}`}>2. 기획</span>
                 <span className="text-slate-700">→</span>
                 <span className={`px-2 py-1 rounded ${step === AppStep.SCRIPT_VIEW ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600'}`}>3. 대본</span>
               </div>
             )}
             <ApiKeyManager onApiKeySet={setApiKey} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        
        {step === AppStep.INPUT && (
          <InputStep 
            value={sourceText} 
            onChange={setSourceText} 
            onAnalyze={handleAnalyze} 
            isAnalyzing={loading} 
          />
        )}

        {step === AppStep.ANALYSIS_VIEW && analysis && (
          <AnalysisView 
            analysis={analysis} 
            onNext={handleGenerateIdeas} 
            isLoading={loading}
          />
        )}

        {(step === AppStep.GENERATING_IDEAS) && (
             <div className="text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-medium text-indigo-300">성공 공식을 기반으로 아이디어를 짜내는 중...</h3>
             </div>
        )}

        {step === AppStep.IDEAS_VIEW && (
          <IdeasView 
            ideas={ideas} 
            onSelect={handleSelectIdea} 
            isLoading={loading}
          />
        )}

        {(step === AppStep.GENERATING_SCRIPT) && (
            // This state is handled within IdeasView overlay usually, but as a fallback
             <div className="text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-medium text-pink-300">대본 작성 중...</h3>
             </div>
        )}

        {step === AppStep.SCRIPT_VIEW && finalScript && selectedIdea && (
          <ScriptView 
            script={finalScript} 
            onReset={handleReset}
            ideas={ideas}
            selectedIdea={selectedIdea}
            onSelectIdea={handleSelectIdeaFromScript}
            isGenerating={loading}
          />
        )}

      </main>
      
      <footer className="py-6 text-center text-slate-600 text-sm">
        <p>© 2024 TubeAlchemy. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;