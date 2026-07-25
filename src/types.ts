export interface GeneratorOptions {
  simplePrompt: string;
  appName: string;
  techStack: string;
  database: string;
  storage: string;
  authType: string;
  integrations: string[];
  targetAudience: string;
  customRequirements: string;
  targetPlatform: 'ChatGPT Work' | 'AI Studio' | 'Claude 3.7' | 'Cursor' | 'Generic AI Coding Agent';
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Finance' | 'CRM' | 'AI Studio' | 'Booking' | 'Analytics' | 'E-Commerce' | 'Education';
  description: string;
  badge: string;
  simplePrompt: string;
  defaultAppName: string;
  defaultTechStack: string;
  defaultDatabase: string;
  defaultStorage: string;
  defaultAuth: string;
  defaultIntegrations: string[];
  fullMasterPrompt?: string;
}

export interface PromptSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

export interface QualityAnalysis {
  overallScore: number;
  schemaScore: number;
  pageSpecsScore: number;
  businessLogicScore: number;
  zeroDataContractScore: number;
  verificationScore: number;
  strengths: string[];
  missingElements: string[];
  recommendations: string[];
}

export interface SavedPrompt {
  id: string;
  title: string;
  appName: string;
  createdAt: string;
  simplePrompt: string;
  masterPrompt: string;
  wordCount: number;
  qualityScore?: number;
  techStack: string;
  tags: string[];
}
