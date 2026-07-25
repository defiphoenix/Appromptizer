import React, { useState } from 'react';
import { SavedPrompt } from '../types';
import { BookmarkCheck, Search, Trash2, ArrowRight, Download, Calendar, Tag, FileText } from 'lucide-react';

interface SavedPromptsDrawerProps {
  savedPrompts: SavedPrompt[];
  onLoadSavedPrompt: (prompt: SavedPrompt) => void;
  onDeleteSavedPrompt: (id: string) => void;
  onClearAll: () => void;
}

export const SavedPromptsDrawer: React.FC<SavedPromptsDrawerProps> = ({
  savedPrompts,
  onLoadSavedPrompt,
  onDeleteSavedPrompt,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedPrompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.techStack.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <BookmarkCheck className="w-6 h-6 text-emerald-600" />
            <span>Saved Prompt Vault</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Access, export, and reload your previously generated SaaS Master Prompts.
          </p>
        </div>

        {savedPrompts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-rose-700 hover:text-rose-800 font-semibold px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-200 hover:bg-rose-100 transition-all flex items-center space-x-1 w-fit cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Vault</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {savedPrompts.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved prompts by app name, tech stack, or tags..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white/90 border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-md">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No Saved Prompts Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {savedPrompts.length === 0
              ? 'Generate a Master Prompt in the Workspace tab and click "Save Prompt" to store it here.'
              : 'No saved prompts match your search terms.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 border border-slate-200/90 rounded-xl p-5 shadow-md space-y-3 hover:border-blue-400 transition-all flex flex-col justify-between backdrop-blur-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">{item.appName}</span>
                  <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{item.simplePrompt}</p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                  <span>{item.wordCount.toLocaleString()} words</span>
                  <span>•</span>
                  <span>Tech: {item.techStack.split(' ')[0]}</span>
                  {item.qualityScore && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">{item.qualityScore}/100 Quality</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  onClick={() => onLoadSavedPrompt(item)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onDeleteSavedPrompt(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete from Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
