import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Layers,
  Shield,
  RefreshCw,
  Zap,
  Code2,
  Wand2,
  Cpu,
  Bot,
  SlidersHorizontal,
  Check,
  ChevronDown
} from 'lucide-react';
import { GeneratorOptions } from '../types';

interface SimplePromptFormProps {
  onGenerate: (options: GeneratorOptions) => void;
  isLoading: boolean;
  onSelectTemplate: (templateId: string) => void;
}

const EXAMPLE_IDEAS = [
  {
    title: 'Budget Tracker',
    appName: 'BudgetIQ',
    prompt: 'Build a personal budget and expense tracker named BudgetIQ with automated spending categorization, budget thresholds, income vs expense charts, and CSV statement imports.',
    techPresetId: 'express-postgres',
    authType: 'Private Owner Access / JWT',
    integrations: ['CSV Bank Statement Import', 'Daily 8:00 AM Cron Automation', 'Google Drive Sync'],
  },
  {
    title: 'Habit Tracker Mobile App',
    appName: 'HabitPulse',
    prompt: 'Build a mobile-first daily habit and routine tracking app named HabitPulse with streak counters, completion history, customizable reminder schedules, and progress analytics.',
    techPresetId: 'react-firebase',
    authType: 'Firebase Auth',
    integrations: ['Twilio SMS Notifications', 'Daily 8:00 AM Cron Automation'],
  },
  {
    title: 'Trading App',
    appName: 'TradeX',
    prompt: 'Build a real-time portfolio and stock trading dashboard named TradeX with live price feeds, paper trading order execution, profit/loss tracking, and AI market sentiment analysis.',
    techPresetId: 'cloudflare-vinext',
    authType: 'OAuth 2.0 / JWT',
    integrations: ['Gemini AI API Proxy', 'Daily 8:00 AM Cron Automation'],
  },
  {
    title: 'Social Community App',
    appName: 'TribeHub',
    prompt: 'Build a niche social community platform named TribeHub with topic discussion feeds, member profiles, event scheduling, and tiered paid memberships with Stripe.',
    techPresetId: 'next-supabase',
    authType: 'Supabase Auth',
    integrations: ['Stripe Billing & Webhooks', 'Gemini AI API Proxy'],
  },
];

const TECH_STACK_PRESETS = [
  {
    id: 'cloudflare-vinext',
    name: 'Cloudflare Stack (Vinext / D1 / R2)',
    badge: 'ChatGPT Work / Sites Standard',
    db: 'Cloudflare D1 Database',
    storage: 'Cloudflare R2 Bucket',
    stack: 'React + Express / Vinext + D1 + R2',
  },
  {
    id: 'express-postgres',
    name: 'Express + Vite + PostgreSQL',
    badge: 'Full-Stack Node Standard',
    db: 'PostgreSQL Database',
    storage: 'S3 Compatible Bucket',
    stack: 'Express + Vite + React + PostgreSQL',
  },
  {
    id: 'next-supabase',
    name: 'Next.js + Supabase + Tailwind',
    badge: 'Modern Fullstack',
    db: 'Supabase PostgreSQL',
    storage: 'Supabase Storage',
    stack: 'Next.js + Supabase + Tailwind CSS',
  },
  {
    id: 'react-firebase',
    name: 'React + Express + Firebase',
    badge: 'Firebase Integration',
    db: 'Firestore Database',
    storage: 'Firebase Storage',
    stack: 'React + Express + Firestore',
  },
];

const INTEGRATION_OPTIONS = [
  'Google Drive Sync',
  'Daily 8:00 AM Cron Automation',
  'Stripe Billing & Webhooks',
  'Google Calendar OAuth',
  'Gemini AI API Proxy',
  'Twilio SMS Notifications',
  'CSV Bank Statement Import',
  'Vector DB / RAG Embeddings',
];

export const SimplePromptForm: React.FC<SimplePromptFormProps> = ({
  onGenerate,
  isLoading,
  onSelectTemplate,
}) => {
  const [simplePrompt, setSimplePrompt] = useState(
    'Build a personal financial dashboard named Ledgerly with Google Drive invoice/receipt inbox sync, automated recurring payment detection, budgets, and net worth calculation.'
  );
  const [appName, setAppName] = useState('Ledgerly');
  const [techPreset, setTechPreset] = useState('cloudflare-vinext');
  const [customStack, setCustomStack] = useState('React + Express / Vinext + D1 + R2');
  const [database, setDatabase] = useState('Cloudflare D1 Database');
  const [storage, setStorage] = useState('Cloudflare R2 Bucket');
  const [authType, setAuthType] = useState('Private Owner Access');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([
    'Google Drive Sync',
    'Daily 8:00 AM Cron Automation',
    'CSV Bank Statement Import',
  ]);
  const [targetPlatform, setTargetPlatform] = useState<GeneratorOptions['targetPlatform']>('ChatGPT Work');
  const [customRequirements, setCustomRequirements] = useState(
    'Ensure strict zero-data cold start contract, exact deduplication fingerprint logic (date|merchant|amount|account), and 15-step verification checklist.'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyPreset = (preset: typeof TECH_STACK_PRESETS[0]) => {
    setTechPreset(preset.id);
    setCustomStack(preset.stack);
    setDatabase(preset.db);
    setStorage(preset.storage);
  };

  const toggleIntegration = (item: string) => {
    if (selectedIntegrations.includes(item)) {
      setSelectedIntegrations(selectedIntegrations.filter((i) => i !== item));
    } else {
      setSelectedIntegrations([...selectedIntegrations, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      simplePrompt,
      appName: appName || 'MySaaS',
      techStack: customStack,
      database,
      storage,
      authType,
      integrations: selectedIntegrations,
      targetAudience: 'General SaaS Users & Product Engineers',
      customRequirements,
      targetPlatform,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <Wand2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Transform 1-Sentence Ideas into SaaS Master Prompts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          SaaS Master Prompt <span className="text-blue-600">Generator</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm">
          Generate complete 20+ section master prompts with explicit database schemas, REST APIs, zero-data contracts, automated business logic, and verification checklists.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="bg-white/90 border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Concept Input Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Concept Input</span>
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded border border-blue-200">
              Phase 1 Blueprint
            </span>
          </div>

          {/* Simple Prompt Input Area */}
          <div className="space-y-2">
            <textarea
              id="simple-prompt-input"
              value={simplePrompt}
              onChange={(e) => setSimplePrompt(e.target.value)}
              placeholder="Describe your SaaS idea briefly (e.g., A micro-SaaS for coffee shop loyalty programs using QR codes)..."
              rows={4}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none placeholder-slate-400 shadow-inner transition-all"
            />
          </div>

          {/* Quick Ideas Chips */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Fast Concept Presets:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSimplePrompt(idea.prompt);
                    setAppName(idea.appName);
                    setAuthType(idea.authType);
                    setSelectedIntegrations(idea.integrations);
                    const matchedPreset = TECH_STACK_PRESETS.find((p) => p.id === idea.techPresetId);
                    if (matchedPreset) {
                      handleApplyPreset(matchedPreset);
                    }
                    if (idea.title === 'Budget Tracker') {
                      onSelectTemplate('ledgerly-benchmark');
                    }
                  }}
                  className="text-left px-3 py-2 bg-slate-50/80 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all group cursor-pointer shadow-2xs"
                >
                  <p className="text-xs font-semibold text-blue-700 group-hover:text-blue-800 flex items-center justify-between">
                    <span>{idea.title}</span>
                    <Zap className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{idea.prompt}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack Presets */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Primary Architecture Stack</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TECH_STACK_PRESETS.map((preset) => {
                const isSelected = techPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 text-slate-900 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{preset.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-200/80 text-slate-600 font-medium rounded block w-fit mb-1.5">
                      {preset.badge}
                    </span>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{preset.db}</p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Core Configuration Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="app-name-input" className="text-[10px] text-slate-500 uppercase font-semibold block">App Name</label>
              <input
                id="app-name-input"
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. Ledgerly"
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 rounded-md focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="target-platform-select" className="text-[10px] text-slate-500 uppercase font-semibold block">Target AI Assistant</label>
              <select
                id="target-platform-select"
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 rounded-md focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="ChatGPT Work">ChatGPT Work (Sites & Automations)</option>
                <option value="AI Studio">Google AI Studio (Cloud Run Apps)</option>
                <option value="Claude 3.7">Claude 3.7 Sonnet / Artifacts</option>
                <option value="Cursor">Cursor / Windsurf AI Rules</option>
                <option value="Generic AI Coding Agent">Generic AI Coding Agent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="auth-model-input" className="text-[10px] text-slate-500 uppercase font-semibold block">Auth Model</label>
              <input
                id="auth-model-input"
                type="text"
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                placeholder="e.g. Private Owner Access"
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 rounded-md focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Integrations Selectors */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-semibold block">
              Select Key Modules & Integrations:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEGRATION_OPTIONS.map((item) => {
                const active = selectedIntegrations.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleIntegration(item)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all border flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-blue-100/80 border-blue-300 text-blue-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-400'}`} />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Accordion Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 font-medium transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>{showAdvanced ? 'Hide Advanced Requirements' : 'Show Advanced Requirements & Custom Notes'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div>
                  <label htmlFor="custom-requirements-input" className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">
                    Custom Constraints / Special Business Logic
                  </label>
                  <textarea
                    id="custom-requirements-input"
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    placeholder="e.g. Include specific deduplication fingerprint string format, 8:00 AM timezone schedule..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !simplePrompt.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 text-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing SaaS Master Prompt...</span>
                </>
              ) : (
                <>
                  <span>Generate Prompt Blueprint</span>
                  <Sparkles className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tip Box */}
      <div className="h-20 bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <Code2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-300 font-medium">Sleek Master Prompt Engine Tip</p>
          <p className="text-[11px] text-slate-500">Include specific domain rules for better database schema generation and zero-data contracts.</p>
        </div>
      </div>
    </div>
  );
};
