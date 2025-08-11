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

export interface Decision {
  id: string;
  title: string;
  options: Option[];
  timestamp: Date;
  selectedOptionId?: string;
  aiSuggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: 'pro' | 'con' | 'option' | 'insight';
  content: string;
  confidence: number;
  optionId?: string;
}

export interface AIAnalysis {
  recommendation: string;
  reasoning: string;
  riskFactors: string[];
  opportunities: string[];
  confidence: number;
}