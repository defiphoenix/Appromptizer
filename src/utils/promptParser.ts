import { PromptSection, QualityAnalysis } from '../types';

export function parsePromptSections(fullPrompt: string): PromptSection[] {
  if (!fullPrompt) return [];

  // Match headers like ## 1. Non-negotiable product rules or # MASTER PROMPT
  const lines = fullPrompt.split('\n');
  const sections: { title: string; contentLines: string[] }[] = [];
  let currentSectionTitle = 'Overview & Mission';
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('# ')) {
      if (currentLines.length > 0) {
        sections.push({
          title: currentSectionTitle,
          contentLines: currentLines,
        });
      }
      currentSectionTitle = line.replace(/^[#]+\s*/, '').trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      title: currentSectionTitle,
      contentLines: currentLines,
    });
  }

  return sections.map((sec, idx) => {
    const content = sec.contentLines.join('\n');
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    return {
      id: `sec-${idx}`,
      title: sec.title,
      content,
      wordCount,
    };
  });
}

export function estimateTokens(prompt: string): number {
  if (!prompt) return 0;
  const words = prompt.trim().split(/\s+/).filter(Boolean).length;
  return Math.round(words * 1.35);
}

export function analyzePromptQualityLocally(prompt: string): QualityAnalysis {
  let schemaScore = 20;
  let pageSpecsScore = 20;
  let businessLogicScore = 20;
  let zeroDataContractScore = 20;
  let verificationScore = 20;

  const lower = prompt.toLowerCase();

  // Check Schema
  if (lower.includes('primary key') || lower.includes('database tables') || lower.includes('d1 tables') || lower.includes('schema')) {
    schemaScore += 40;
  }
  if (lower.includes('fingerprint') || lower.includes('unique') || lower.includes('not null')) {
    schemaScore += 40;
  }

  // Check Page Specs
  if (lower.includes('dashboard') && lower.includes('settings') && lower.includes('transactions')) {
    pageSpecsScore += 40;
  }
  if (lower.includes('modal') && lower.includes('empty state') && lower.includes('inline')) {
    pageSpecsScore += 40;
  }

  // Check Business Logic
  if (lower.includes('algorithm') || lower.includes('cadence') || lower.includes('interval') || lower.includes('deduplication')) {
    businessLogicScore += 40;
  }
  if (lower.includes('confidence') || lower.includes('normalization') || lower.includes('formula')) {
    businessLogicScore += 40;
  }

  // Check Zero Data Contract
  if (lower.includes('empty-start') || lower.includes('empty start') || lower.includes('no sample data') || lower.includes('cold start')) {
    zeroDataContractScore += 40;
  }
  if (lower.includes('transactions = []') || lower.includes('zero') || lower.includes('not set')) {
    zeroDataContractScore += 40;
  }

  // Check Verification
  if (lower.includes('verification') || lower.includes('verify') || lower.includes('checklist')) {
    verificationScore += 40;
  }
  if (lower.includes('completion response') || lower.includes('handoff')) {
    verificationScore += 40;
  }

  const overall = Math.round((schemaScore + pageSpecsScore + businessLogicScore + zeroDataContractScore + verificationScore) / 5);

  const strengths: string[] = [];
  const missingElements: string[] = [];
  const recommendations: string[] = [];

  if (schemaScore >= 80) strengths.push('Explicit Database Schema & Primary Keys defined');
  else missingElements.push('Database Schema lacks explicit table column types or constraints');

  if (pageSpecsScore >= 80) strengths.push('Comprehensive multi-view page specifications with empty states');
  else missingElements.push('Page specifications could detail individual modals and empty state rules further');

  if (zeroDataContractScore >= 80) strengths.push('Strict Zero-Data Cold Start contract preventing dummy clutter');
  else recommendations.push('Add an explicit Cold Start Contract section (e.g. transactions = [])');

  if (verificationScore >= 80) strengths.push('Actionable 15+ step functional verification matrix');

  return {
    overallScore: Math.min(overall, 99),
    schemaScore: Math.min(schemaScore, 100),
    pageSpecsScore: Math.min(pageSpecsScore, 100),
    businessLogicScore: Math.min(businessLogicScore, 100),
    zeroDataContractScore: Math.min(zeroDataContractScore, 100),
    verificationScore: Math.min(verificationScore, 100),
    strengths,
    missingElements,
    recommendations,
  };
}
