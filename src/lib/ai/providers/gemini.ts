import { AIProvider, Decision, AIAnalysis, AISuggestion } from '@/types';
import { AIPrompts } from '../prompts';

/**
 * Google Gemini Provider - FREE tier available
 * - Gemini Pro model free tier
 * - 60 requests per minute
 * - Get API key at: https://ai.google.dev/
 */
export class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model: string;

  constructor(apiKey: string, model = 'gemini-pro') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyze(decision: Decision): Promise<AIAnalysis> {
    try {
      const prompt = AIPrompts.createAnalysisPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return this.validateAnalysis(analysis);
      }
      
      return this.getFallbackAnalysis(decision);
    } catch (error) {
      console.error('Gemini analysis error:', error);
      return this.getFallbackAnalysis(decision);
    }
  }

  async generateSuggestions(decision: Decision): Promise<AISuggestion[]> {
    try {
      const prompt = AIPrompts.createSuggestionsPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions : [];
      }
      
      return this.getFallbackSuggestions(decision);
    } catch (error) {
      console.error('Gemini suggestions error:', error);
      return this.getFallbackSuggestions(decision);
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.baseURL}/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
      (current.score ?? 0) > (best.score ?? 0) ? current : best
    );

    return {
      recommendation: topOption.title,
      reasoning: `${topOption.title} has the highest score with ${topOption.score ?? 0} advantages and ${topOption.score ?? 0} concerns identified.`,
      riskFactors: ['AI analysis temporarily unavailable', 'Consider seeking additional expert input'],
      opportunities: ['Explore implementation details', 'Research success stories'],
      longTermBenefits: ['Option shows promise based on current evaluation'],
      potentialDrawbacks: ['Limited AI insights available'],
      alternativeOptions: ['Consider phased implementation', 'Hybrid solution combining options'],
      confidence: 70,
      uncertaintyAreas: ['AI provider connectivity'],
      keyFactors: [],
      timeHorizon: {
        shortTerm: 'Begin with highest-rated option',
        mediumTerm: 'Evaluate progress and adjust approach',
        longTerm: 'Scale successful elements'
      }
    };
  }

  private getFallbackSuggestions(decision: Decision): AISuggestion[] {
    return [
      {
        id: 'fallback-research',
        type: 'insight',
        content: 'Research industry best practices for similar decisions',
        confidence: 85,
        importance: 'high'
      },
      {
        id: 'fallback-stakeholder',
        type: 'question',
        content: 'Who are the key stakeholders affected by this decision?',
        confidence: 90,
        importance: 'high'
      }
    ];
  }
}
