import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  Edit3,
  BookmarkPlus,
  Zap,
  BarChart2,
  Sliders,
  FileCode,
  ListOrdered,
  Maximize2,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { parsePromptSections, estimateTokens, analyzePromptQualityLocally } from '../utils/promptParser';
import { QualityAnalysis, SavedPrompt } from '../types';

interface PromptOutputViewProps {
  promptText: string;
  appName: string;
  techStack: string;
  simplePrompt: string;
  onSavePrompt: (prompt: Omit<SavedPrompt, 'id' | 'createdAt'>) => void;
  onRefinePrompt: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onOpenAnalysis: (analysis: QualityAnalysis) => void;
}

export const PromptOutputView: React.FC<PromptOutputViewProps> = ({
  promptText,
  appName,
  techStack,
  simplePrompt,
  onSavePrompt,
  onRefinePrompt,
  isRefining,
  onOpenAnalysis,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'full' | 'sections' | 'variables' | 'refine'>('full');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-0');
  const [refinementInput, setRefinementInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Variables state
  const [vars, setVars] = useState({
    APP_NAME: appName || 'Ledgerly',
    SITE_URL: 'https://my-app.run.app',
    DRIVE_FOLDER: `${appName || 'Ledgerly'} Financial Inbox`,
    DRIVE_FOLDER_ID: '1a2b3c4d5e6f',
    TIMEZONE: 'America/New_York',
  });

  const sections = parsePromptSections(promptText);

  // Variable replacement in full text
  const getProcessedPrompt = () => {
    let result = promptText;
    result = result.replaceAll('<EXACT_SITE_URL>', vars.SITE_URL);
    result = result.replaceAll('<EXACT_DRIVE_FOLDER_NAME>', vars.DRIVE_FOLDER);
    result = result.replaceAll('<EXACT_DRIVE_FOLDER_ID>', vars.DRIVE_FOLDER_ID);
    result = result.replaceAll('<my timezone>', vars.TIMEZONE);
    return result;
  };

  const finalPromptText = getProcessedPrompt();
  const totalChars = finalPromptText.length;
  const totalWords = finalPromptText.trim().split(/\s+/).filter(Boolean).length;
  const tokenEstimate = estimateTokens(finalPromptText);
  const localQuality = analyzePromptQualityLocally(finalPromptText);

  const handleCopy = (text: string, targetName: string = 'full') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedTarget(targetName);
    setTimeout(() => {
      setCopied(false);
      setCopiedTarget(null);
    }, 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([finalPromptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(appName || 'Master-Prompt').toLowerCase().replace(/\s+/g, '-')}-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSavePrompt({
      title: `${appName} Master Prompt`,
      appName,
      simplePrompt,
      masterPrompt: finalPromptText,
      wordCount: totalWords,
      qualityScore: localQuality.overallScore,
      techStack,
      tags: ['SaaS', appName, techStack.split(' ')[0]],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim()) return;
    await onRefinePrompt(refinementInput);
    setRefinementInput('');
  };

  const filteredSections = searchQuery
    ? sections.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : sections;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Bar with Metrics & Action Bar */}
      <div className="bg-white/90 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xl space-y-4 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">
                Generated SaaS Blueprint: <span className="text-blue-600">{appName || 'Master Spec'}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Architecture: <span className="text-slate-800 font-semibold">{techStack}</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 sm:space-x-4 bg-slate-50 px-3 sm:px-4 py-2 rounded-lg border border-slate-200 shadow-2xs">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Characters</p>
              <p className="text-sm font-bold text-slate-800">{totalChars.toLocaleString()}</p>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Words</p>
              <p className="text-sm font-bold text-slate-900">{totalWords.toLocaleString()}</p>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Est. Tokens</p>
              <p className="text-sm font-bold text-blue-600">{tokenEstimate.toLocaleString()}</p>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onOpenAnalysis(localQuality)}>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quality Score</p>
              <p className="text-sm font-extrabold text-emerald-600 flex items-center justify-center space-x-0.5">
                <span>{localQuality.overallScore}</span>
                <span className="text-[10px] text-slate-400">/100</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopy(finalPromptText, 'full')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              {copied && copiedTarget === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied && copiedTarget === 'full' ? 'Copied Full Prompt!' : 'Copy Master Prompt'}</span>
            </button>

            <button
              onClick={() => handleCopy(finalPromptText, 'chatgpt')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-md border border-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>ChatGPT Work Format</span>
            </button>

            <button
              onClick={() => handleCopy(finalPromptText, 'aistudio')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-md border border-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Studio Format</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-md border border-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download as .md</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAnalysis(localQuality)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Audit Report</span>
            </button>

            <button
              onClick={handleSave}
              className={`px-3 py-1.5 font-medium text-xs rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                saved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <BookmarkPlus className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{saved ? 'Saved to Vault!' : 'Save Prompt'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1 border-b border-slate-200 pt-1">
          <button
            onClick={() => setViewMode('full')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-t-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'full'
                ? 'bg-slate-900 text-white border-t border-x border-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Full Document</span>
          </button>

          <button
            onClick={() => setViewMode('sections')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-t-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'sections'
                ? 'bg-slate-900 text-white border-t border-x border-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
            <span>Section Inspector ({sections.length})</span>
          </button>

          <button
            onClick={() => setViewMode('variables')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-t-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'variables'
                ? 'bg-slate-900 text-amber-300 border-t border-x border-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Variable Injector</span>
          </button>

          <button
            onClick={() => setViewMode('refine')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-t-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'refine'
                ? 'bg-slate-900 text-purple-300 border-t border-x border-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Refinement</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Full Document Monospace Display with Sleek Floating Copy Button */}
      {viewMode === 'full' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          <div className="h-10 border-b border-slate-800 flex items-center justify-between px-5 bg-slate-800/60">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-slate-200">master_prompt_blueprint.md</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[10px] rounded text-slate-300 font-mono">
                {totalChars.toLocaleString()} chars
              </span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[10px] rounded text-blue-300 font-mono">
                ~{tokenEstimate.toLocaleString()} tokens
              </span>
              <span className="px-2 py-0.5 bg-blue-600 text-[10px] rounded text-white font-bold font-mono">SPEC</span>
            </div>
          </div>

          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-hidden">
            <pre className="h-[650px] bg-slate-950 rounded-lg p-5 border border-slate-800 text-blue-200 overflow-y-auto whitespace-pre-wrap selection:bg-blue-800 selection:text-white">
              {finalPromptText}
            </pre>
          </div>

          {/* Floating Action Pill Buttons */}
          <div className="absolute bottom-10 right-10 z-20 flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 px-5 py-3 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download as .md</span>
            </button>
            <button
              onClick={() => handleCopy(finalPromptText, 'floating')}
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              {copied && copiedTarget === 'floating' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-900" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Section Accordion / Inspector */}
      {viewMode === 'sections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section Sidebar List */}
          <div className="lg:col-span-4 bg-white/90 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredSections.map((sec, idx) => {
                const isActive = sec.id === activeSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border ${
                      isActive
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-semibold line-clamp-1">{sec.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>Section {idx + 1}</span>
                      <span>{sec.wordCount} words</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Content Detail Viewer */}
          <div className="lg:col-span-8 bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
            {activeSectionId && (
              <>
                {(() => {
                  const currentSec = sections.find((s) => s.id === activeSectionId);
                  if (!currentSec) return <p className="text-slate-500">Select a section to inspect.</p>;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{currentSec.title}</h3>
                          <span className="text-xs text-slate-500">{currentSec.wordCount} words</span>
                        </div>
                        <button
                          onClick={() => handleCopy(currentSec.content, currentSec.id)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 flex items-center space-x-1 cursor-pointer"
                        >
                          {copied && copiedTarget === currentSec.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          <span>Copy Section</span>
                        </button>
                      </div>

                      <pre className="text-slate-800 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto pr-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        {currentSec.content}
                      </pre>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Variable Replacer */}
      {viewMode === 'variables' && (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <span>Prompt Variable Injector</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Replace template placeholders (e.g., &lt;EXACT_SITE_URL&gt;, &lt;EXACT_DRIVE_FOLDER_NAME&gt;) with your actual runtime target values before copying.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">App Name (&lt;APP_NAME&gt;)</label>
              <input
                type="text"
                value={vars.APP_NAME}
                onChange={(e) => setVars({ ...vars, APP_NAME: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Site / App URL (&lt;EXACT_SITE_URL&gt;)</label>
              <input
                type="text"
                value={vars.SITE_URL}
                onChange={(e) => setVars({ ...vars, SITE_URL: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Folder Name (&lt;EXACT_DRIVE_FOLDER_NAME&gt;)</label>
              <input
                type="text"
                value={vars.DRIVE_FOLDER}
                onChange={(e) => setVars({ ...vars, DRIVE_FOLDER: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Folder ID (&lt;EXACT_DRIVE_FOLDER_ID&gt;)</label>
              <input
                type="text"
                value={vars.DRIVE_FOLDER_ID}
                onChange={(e) => setVars({ ...vars, DRIVE_FOLDER_ID: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Local Timezone (&lt;my timezone&gt;)</label>
              <input
                type="text"
                value={vars.TIMEZONE}
                onChange={(e) => setVars({ ...vars, TIMEZONE: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleCopy(finalPromptText, 'replaced')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              {copied && copiedTarget === 'replaced' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
              <span>{copied && copiedTarget === 'replaced' ? 'Copied Injected Prompt!' : 'Copy Prompt with Injected Variables'}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 4: AI Refinement Studio */}
      {viewMode === 'refine' && (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>AI Refinement Studio</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Ask Gemini to modify or expand specific parts of this Master Prompt (e.g. "Add PostgreSQL Prisma schema", "Add a team permissions role matrix", "Include Stripe webhook event handling").
            </p>
          </div>

          <form onSubmit={handleRefineSubmit} className="space-y-4">
            <textarea
              value={refinementInput}
              onChange={(e) => setRefinementInput(e.target.value)}
              placeholder="e.g. Add a team collaboration workspace page with role-based access control, and update the database schema with workspace_members table..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="text-slate-500 font-semibold">Quick refinements:</span>
                <button
                  type="button"
                  onClick={() => setRefinementInput('Add multi-currency support with conversion rates API in settings and transactions.')}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200"
                >
                  + Multi-Currency
                </button>
                <button
                  type="button"
                  onClick={() => setRefinementInput('Switch database schema from Cloudflare D1 to PostgreSQL Prisma definitions.')}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200"
                >
                  + PostgreSQL / Prisma
                </button>
                <button
                  type="button"
                  onClick={() => setRefinementInput('Add an explicit OAuth login flow specification for GitHub & Google.')}
                  className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200"
                >
                  + OAuth Flow
                </button>
              </div>

              <button
                type="submit"
                disabled={isRefining || !refinementInput.trim()}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isRefining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Refining Spec...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Apply AI Refinement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
