import React from 'react';
import { PROMPT_TEMPLATES } from '../data/templates';
import { PromptTemplate } from '../types';
import { BookOpen, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>SaaS Master Prompt Archetypes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Benchmark SaaS Archetypes & Templates
        </h2>
        <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm">
          Select an archetype to inspect its full master prompt structure, database schema, state APIs, and business rules, or customize it for your project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROMPT_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white/90 border border-slate-200/90 hover:border-blue-400 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden backdrop-blur-sm"
          >
            {tmpl.id === 'ledgerly-benchmark' && (
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg shadow-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-950" />
                <span>Gold Benchmark</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider">
                  {tmpl.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {tmpl.description}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Database className="w-3 h-3 text-blue-600" />
                    <span>Database:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{tmpl.defaultDatabase}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-blue-600" />
                    <span>Integrations:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{tmpl.defaultIntegrations.length} Included</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/80">
              <button
                onClick={() => onSelectTemplate(tmpl)}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-md shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Load Template Spec</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
