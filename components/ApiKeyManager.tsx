import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Check } from 'lucide-react';

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
}

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on mount
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      setHasStoredKey(true);
      onApiKeySet(storedKey);
    } else {
      setIsOpen(true); // Open automatically if no key is stored
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('API 키를 입력해주세요.');
      return;
    }

    setSavedStatus('saving');
    
    // Save to localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    onApiKeySet(apiKey.trim());
    setHasStoredKey(true);

    setTimeout(() => {
      setSavedStatus('saved');
      setTimeout(() => {
        setSavedStatus('idle');
        setIsOpen(false);
      }, 1000);
    }, 300);
  };

  const handleClear = () => {
    if (window.confirm('저장된 API 키를 삭제하시겠습니까?')) {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey('');
      setHasStoredKey(false);
      setSavedStatus('idle');
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
          hasStoredKey
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50'
        }`}
        title={hasStoredKey ? 'API 키 관리' : 'API 키 설정 필요'}
      >
        <Settings size={16} className={!hasStoredKey ? 'animate-pulse' : ''} />
        <span className="hidden sm:inline">API 키</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Gemini API 키 설정</h3>
              {hasStoredKey && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Google AI Studio에서 발급받은 API 키를 입력하세요.
              </p>
              
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  type="button"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 inline-block"
              >
                API 키 발급받기 →
              </a>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={savedStatus === 'saving' || savedStatus === 'saved'}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  savedStatus === 'saved'
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {savedStatus === 'saved' ? (
                  <>
                    <Check size={18} />
                    저장됨
                  </>
                ) : (
                  '저장하기'
                )}
              </button>
              
              {hasStoredKey && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-lg font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 transition-all"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
