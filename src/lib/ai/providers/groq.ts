import { AIProvider, Decision, AIAnalysis, AISuggestion } from '@/types';
import { AIPrompts } from '../prompts';

/**
 * Groq AI Provider - FREE tier available
 * - Fast inference with Llama models
 * - Free tier: 14,400 tokens/day
 * - Sign up at: https://console.groq.com/
 */
export class GroqProvider implements AIProvider {
  name = 'Groq (Llama)';
  private apiKey: string;
  private baseURL = 'https://api.groq.com/openai/v1';
  private model: string;

  constructor(apiKey: string, model = 'llama3-8b-8192') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyze(decision: Decision): Promise<AIAnalysis> {
    try {
      const prompt = AIPrompts.createAnalysisPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      // Parse and validate the response
      const analysis = JSON.parse(response);
      return this.validateAnalysis(analysis);
    } catch (error) {
      console.error('Groq analysis error:', error);
      return this.getFallbackAnalysis(decision);
    }
  }

  async generateSuggestions(decision: Decision): Promise<AISuggestion[]> {
    try {
      const prompt = AIPrompts.createSuggestionsPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      const suggestions = JSON.parse(response);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
      console.error('Groq suggestions error:', error);
      return this.getFallbackSuggestions(decision);
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional decision analyst. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private validateAnalysis(analysis: any): AIAnalysis {
    return {
      recommendation: analysis.recommendation || 'Unable to determine recommendation',
      reasoning: analysis.reasoning || 'Analysis not available',
      riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors : [],
      opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities : [],
      longTermBenefits: Array.isArray(analysis.longTermBenefits) ? analysis.longTermBenefits : [],
      potentialDrawbacks: Array.isArray(analysis.potentialDrawbacks) ? analysis.potentialDrawbacks : [],
      alternativeOptions: Array.isArray(analysis.alternativeOptions) ? analysis.alternativeOptions : [],
      confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 50,
      uncertaintyAreas: Array.isArray(analysis.uncertaintyAreas) ? analysis.uncertaintyAreas : [],
      keyFactors: Array.isArray(analysis.keyFactors) ? analysis.keyFactors : [],
      timeHorizon: analysis.timeHorizon || {
        shortTerm: 'Short-term impact assessment not available',
        mediumTerm: 'Medium-term impact assessment not available',
        longTerm: 'Long-term impact assessment not available'
      }
    };
  }

  private getFallbackAnalysis(decision: Decision): AIAnalysis {
    const options = decision.options;
    const topOption = options.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return {
      recommendation: topOption.title,
      reasoning: `Based on the current scoring system, ${topOption.title} has the highest score (${topOption.score}).`,
      riskFactors: ['AI analysis temporarily unavailable', 'Consider verifying the scoring manually'],
      opportunities: ['Review the pros and cons for each option', 'Consider additional factors not yet listed'],
      longTermBenefits: ['The selected option shows the most favorable immediate balance'],
      potentialDrawbacks: ['Scoring may not capture all important factors'],
      alternativeOptions: ['Consider combining elements from multiple options'],
      confidence: 60,
      uncertaintyAreas: ['AI analysis needs to be re-attempted'],
      keyFactors: [],
      timeHorizon: {
        shortTerm: 'Immediate implementation based on current analysis',
        mediumTerm: 'Monitor outcomes and adjust as needed',
        longTerm: 'Reassess decision effectiveness over time'
      }
    };
  }

  private getFallbackSuggestions(decision: Decision): AISuggestion[] {
    return [
      {
        id: 'fallback-1',
        type: 'question',
        content: 'What are the most important criteria for this decision?',
        confidence: 80,
        importance: 'high'
      },
      {
        id: 'fallback-2', 
        type: 'insight',
        content: 'Consider the long-term implications of each option',
        confidence: 85,
        importance: 'high'
      }
    ];
  }
}
