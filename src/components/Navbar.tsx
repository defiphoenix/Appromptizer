import React from 'react';
import { Terminal, Sparkles, BookOpen, Layers, BookmarkCheck, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'templates' | 'inspector' | 'vault';
  setActiveTab: (tab: 'generator' | 'templates' | 'inspector' | 'vault') => void;
  savedCount: number;
  hasPrompt: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  hasPrompt,
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-800 shrink-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic text-base shadow-md shadow-blue-500/20">
              A
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Appromptizer
              </span>
              <span className="text-blue-700 text-[10px] font-bold uppercase tracking-widest ml-1 align-top bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                PRO
              </span>
            </div>
          </div>

          {/* Navigation Links / Tabs */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex items-center space-x-4 text-xs font-medium uppercase tracking-widest">
              <button
                onClick={() => setActiveTab('generator')}
                className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'generator'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'templates'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>

              {hasPrompt && (
                <button
                  onClick={() => setActiveTab('inspector')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'inspector'
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Prompt Studio</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('vault')}
                className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 relative ${
                  activeTab === 'vault'
                    ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Vault</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full ml-1 shadow-sm">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setActiveTab('templates')}
              className="hidden sm:inline-flex px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-full border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-xs"
            >
              Archetype Specs
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

