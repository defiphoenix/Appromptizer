import React from 'react';
import { QualityAnalysis } from '../types';
import { X, CheckCircle, AlertTriangle, Lightbulb, Shield, Award, Layers } from 'lucide-react';

interface QualityAnalyzerModalProps {
  analysis: QualityAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QualityAnalyzerModal: React.FC<QualityAnalyzerModalProps> = ({
  analysis,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Prompt Architectural Quality Audit</h3>
            <p className="text-xs text-slate-500">Deep structural check against production-grade AI prompt requirements</p>
          </div>
        </div>

        {/* Overall Score Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Overall Prompt Score</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-emerald-600">{analysis.overallScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {analysis.overallScore >= 90 ? 'Production Grade' : 'Good Quality'}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Ready for ChatGPT / AI Studio</p>
          </div>
        </div>

        {/* Dimension Scores */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dimension Breakdowns</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Database Schema Precision</span>
                <span className="text-blue-600">{analysis.schemaScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${analysis.schemaScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Page & UI Specifications</span>
                <span className="text-blue-600">{analysis.pageSpecsScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${analysis.pageSpecsScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Automated Business Logic</span>
                <span className="text-blue-600">{analysis.businessLogicScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${analysis.businessLogicScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Zero-Data Cold Start Contract</span>
                <span className="text-emerald-600">{analysis.zeroDataContractScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${analysis.zeroDataContractScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {analysis.strengths.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Audited Strengths</span>
              </span>
              <ul className="space-y-1 text-xs text-slate-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                {analysis.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.missingElements.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-700 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Recommendations</span>
              </span>
              <ul className="space-y-1 text-xs text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                {analysis.missingElements.map((m, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
