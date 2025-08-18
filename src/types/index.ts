export interface Pro {
  id: string;
  text: string;
}

export interface Con {
  id: string;
  text: string;
}

export interface Option {
  id: string;
  title: string;
  pros: Pro[];
  cons: Con[];
  score: number;
}

export interface Priority {
  id: string;
  name: string;
  weight: number; // 0-100 percentage
  description?: string;
}

export interface Decision {
  id: string;
  title: string;
  options: Option[];
  priorities?: Priority[];
  timestamp: Date;
  selectedOptionId?: string;
  aiSuggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: 'pro' | 'con' | 'option' | 'insight' | 'alternative' | 'warning' | 'question';
  content: string;
  confidence: number;
  optionId?: string;
  importance?: 'low' | 'medium' | 'high';
}

export interface AIAnalysis {
  recommendation: string;
  reasoning: string;
  riskFactors: string[];
  opportunities: string[];
  longTermBenefits: string[];
  potentialDrawbacks: string[];
  alternativeOptions: string[];
  confidence: number;
  uncertaintyAreas: string[];
  keyFactors: Array<{
    factor: string;
    weight: number;
    favorsOption: string;
  }>;
  priorityScores?: Array<{
    optionId: string;
    optionName: string;
    scores: Array<{
      priority: string;
      score: number; // 0-10
      weightedScore: number; // score * weight
    }>;
    totalScore: number;
  }>;
  timeHorizon: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
}

export interface AIProvider {
  name: string;
  analyze: (decision: Decision) => Promise<AIAnalysis>;
  generateSuggestions: (decision: Decision) => Promise<AISuggestion[]>;
}

export interface AIConfig {
  provider: 'groq' | 'huggingface' | 'openai' | 'gemini';
  apiKey?: string;
  model?: string;
  baseURL?: string;
}