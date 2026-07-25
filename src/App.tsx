import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SimplePromptForm } from './components/SimplePromptForm';
import { PromptOutputView } from './components/PromptOutputView';
import { TemplateGallery } from './components/TemplateGallery';
import { QualityAnalyzerModal } from './components/QualityAnalyzerModal';
import { SavedPromptsDrawer } from './components/SavedPromptsDrawer';
import { GeneratorOptions, PromptTemplate, QualityAnalysis, SavedPrompt } from './types';
import { LEDGERLY_BENCHMARK_PROMPT, PROMPT_TEMPLATES } from './data/templates';
import { analyzePromptQualityLocally } from './utils/promptParser';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'inspector' | 'vault'>('generator');
  
  // Active Master Prompt state
  const [masterPrompt, setMasterPrompt] = useState<string>(LEDGERLY_BENCHMARK_PROMPT);
  const [activeAppName, setActiveAppName] = useState<string>('Ledgerly');
  const [activeTechStack, setActiveTechStack] = useState<string>('Express + Vite + React + Cloudflare D1/R2');
  const [activeSimplePrompt, setActiveSimplePrompt] = useState<string>(
    'Build a personal financial dashboard named Ledgerly with Google Drive invoice/receipt inbox sync, automated recurring payment detection, budgets, and net worth calculation.'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quality Modal State
  const [auditAnalysis, setAuditAnalysis] = useState<QualityAnalysis | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Saved Vault State (persisted to localStorage)
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    try {
      const stored = localStorage.getItem('appromptizer_saved_prompts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appromptizer_saved_prompts', JSON.stringify(savedPrompts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedPrompts]);

  // Handle Generation via Server API
  const handleGeneratePrompt = async (options: GeneratorOptions) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error generating prompt');
      }

      const data = await response.json();
      if (data.prompt) {
        setMasterPrompt(data.prompt);
        setActiveAppName(options.appName);
        setActiveTechStack(options.techStack);
        setActiveSimplePrompt(options.simplePrompt);
        setActiveTab('inspector');
      }
    } catch (err: any) {
      console.error('Generation Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred while generating the prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle AI Refinement
  const handleRefinePrompt = async (instruction: string) => {
    setIsRefining(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPrompt: masterPrompt, instruction }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error refining prompt');
      }

      const data = await response.json();
      if (data.prompt) {
        setMasterPrompt(data.prompt);
      }
    } catch (err: any) {
      console.error('Refine Error:', err);
      setErrorMsg(err.message || 'Failed to refine prompt.');
    } finally {
      setIsRefining(false);
    }
  };

  // Select Archetype Template
  const handleSelectTemplate = (template: PromptTemplate) => {
    setActiveAppName(template.defaultAppName);
    setActiveTechStack(template.defaultTechStack);
    setActiveSimplePrompt(template.simplePrompt);

    if (template.fullMasterPrompt) {
      setMasterPrompt(template.fullMasterPrompt);
      setActiveTab('inspector');
    } else {
      // Auto-generate if no full prompt attached
      handleGeneratePrompt({
        simplePrompt: template.simplePrompt,
        appName: template.defaultAppName,
        techStack: template.defaultTechStack,
        database: template.defaultDatabase,
        storage: template.defaultStorage,
        authType: template.defaultAuth,
        integrations: template.defaultIntegrations,
        targetAudience: 'SaaS Users',
        customRequirements: '',
        targetPlatform: 'ChatGPT Work',
      });
    }
  };

  // Save Prompt to Vault
  const handleSavePrompt = (promptData: Omit<SavedPrompt, 'id' | 'createdAt'>) => {
    const newSaved: SavedPrompt = {
      ...promptData,
      id: `prompt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavedPrompts((prev) => [newSaved, ...prev]);
  };

  const handleDeleteSavedPrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllVault = () => {
    if (confirm('Are you sure you want to delete all saved prompts?')) {
      setSavedPrompts([]);
    }
  };

  const handleLoadSavedPrompt = (saved: SavedPrompt) => {
    setMasterPrompt(saved.masterPrompt);
    setActiveAppName(saved.appName);
    setActiveTechStack(saved.techStack);
    setActiveSimplePrompt(saved.simplePrompt);
    setActiveTab('inspector');
  };

  const handleOpenAnalysis = (analysis: QualityAnalysis) => {
    setAuditAnalysis(analysis);
    setIsAuditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-wavy-light text-slate-800 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Abstract Background Waves & Light Blue Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        {/* Soft Radial Gradient Bubbles */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[650px] h-[650px] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl" />

        {/* Abstract Wavy SVG Overlay Lines */}
        <svg className="absolute top-0 left-0 w-full h-full text-blue-200/40" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none">
          <path d="M-100 120 C200 300, 400 -50, 800 200 C1200 450, 1400 100, 1600 250" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-100 280 C300 450, 600 100, 950 350 C1250 550, 1450 200, 1600 380" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
          <path d="M-100 550 C250 300, 500 650, 900 400 C1200 200, 1500 500, 1600 350" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedPrompts.length}
          hasPrompt={Boolean(masterPrompt)}
        />

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="max-w-5xl mx-auto mt-4 px-4">
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-center justify-between shadow-sm">
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-xs bg-rose-100 px-2.5 py-1 rounded-md hover:bg-rose-200 text-rose-800 font-semibold cursor-pointer transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Tab Views */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'generator' && (
            <SimplePromptForm
              onGenerate={handleGeneratePrompt}
              isLoading={isLoading}
              onSelectTemplate={(tmplId) => {
                const found = PROMPT_TEMPLATES.find((t) => t.id === tmplId);
                if (found) handleSelectTemplate(found);
              }}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateGallery onSelectTemplate={handleSelectTemplate} />
          )}

          {activeTab === 'inspector' && masterPrompt && (
            <PromptOutputView
              promptText={masterPrompt}
              appName={activeAppName}
              techStack={activeTechStack}
              simplePrompt={activeSimplePrompt}
              onSavePrompt={handleSavePrompt}
              onRefinePrompt={handleRefinePrompt}
              isRefining={isRefining}
              onOpenAnalysis={handleOpenAnalysis}
            />
          )}

          {activeTab === 'vault' && (
            <SavedPromptsDrawer
              savedPrompts={savedPrompts}
              onLoadSavedPrompt={handleLoadSavedPrompt}
              onDeleteSavedPrompt={handleDeleteSavedPrompt}
              onClearAll={handleClearAllVault}
            />
          )}
        </main>
      </div>

      {/* Audit Modal */}
      <QualityAnalyzerModal
        analysis={auditAnalysis}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 text-center text-xs text-slate-500 mt-12 relative z-10">
        <p>Appromptizer — Generate Production-Grade SaaS Master Prompts for AI Studio & ChatGPT Work</p>
      </footer>
    </div>
  );

}
