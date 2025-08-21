import { AIProvider, Decision, AIAnalysis, AISuggestion } from '@/types';
import { AIPrompts } from '../prompts';

/**
 * Hugging Face Provider - FREE tier available
 * - Free inference API for many models
 * - Rate limits: 1000 requests/hour for free tier
 * - Sign up at: https://huggingface.co/
 */
export class HuggingFaceProvider implements AIProvider {
  name = 'Hugging Face';
  private apiKey: string;
  private baseURL = 'https://api-inference.huggingface.co/models';
  private model: string;

  constructor(apiKey: string, model = 'microsoft/DialoGPT-large') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyze(decision: Decision): Promise<AIAnalysis> {
    try {
      const prompt = AIPrompts.createAnalysisPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return this.validateAnalysis(analysis);
      }
      
      return this.getFallbackAnalysis(decision);
    } catch (error) {
      console.error('Hugging Face analysis error:', error);
      return this.getFallbackAnalysis(decision);
    }
  }

  async generateSuggestions(decision: Decision): Promise<AISuggestion[]> {
    try {
      const prompt = AIPrompts.createSuggestionsPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      // Extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions : [];
      }
      
      return this.getFallbackSuggestions(decision);
    } catch (error) {
      console.error('Hugging Face suggestions error:', error);
      return this.getFallbackSuggestions(decision);
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/${this.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';
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
      reasoning: `Based on current scoring, ${topOption.title} appears most favorable with ${topOption.score ?? 0} pros and ${topOption.score ?? 0} cons.`,
      riskFactors: ['AI analysis temporarily unavailable', 'Manual verification recommended'],
      opportunities: ['Consider additional research', 'Seek expert opinions'],
      longTermBenefits: ['Selected option has favorable immediate indicators'],
      potentialDrawbacks: ['Limited AI analysis available'],
      alternativeOptions: ['Hybrid approaches combining multiple options'],
      confidence: 65,
      uncertaintyAreas: ['AI provider response quality'],
      keyFactors: [],
      timeHorizon: {
        shortTerm: 'Proceed with highest-scoring option',
        mediumTerm: 'Monitor and adjust based on outcomes',
        longTerm: 'Reassess decision criteria and methods'
      }
    };
  }

  private getFallbackSuggestions(decision: Decision): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    decision.options.forEach((option, index) => {
      if (option.score === 0) {
        suggestions.push({
          id: `fallback-pro-${index}`,
          type: 'question',
          content: `What are the main advantages of ${option.title}?`,
          confidence: 80,
          optionId: option.id,
          importance: 'medium'
        });
      }
      
      if (option.score === 0) {
        suggestions.push({
          id: `fallback-con-${index}`,
          type: 'question',
          content: `What potential drawbacks should be considered for ${option.title}?`,
          confidence: 80,
          optionId: option.id,
          importance: 'medium'
        });
      }
    });

    return suggestions;
  }
}
