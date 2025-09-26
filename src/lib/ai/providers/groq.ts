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

  constructor(apiKey: string, model = 'llama-3.1-8b-instant') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyze(decision: Decision): Promise<AIAnalysis> {
    try {
      const prompt = AIPrompts.createAnalysisPrompt(decision);
      const response = await this.makeRequest(prompt);
      
      // Parse and validate the response
      let analysis;
      try {
        // Try to find the first valid JSON object in the response string
        const firstBrace = response.indexOf('{');
        const lastBrace = response.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonString = response.slice(firstBrace, lastBrace + 1);
          analysis = JSON.parse(jsonString);
        } else {
          throw new SyntaxError('No valid JSON object found in response');
        }
      } catch (err) {
        throw new SyntaxError('Failed to parse Groq response as JSON: ' + (err instanceof Error ? err.message : String(err)));
      }
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
    
    // Generate meaningful scores based on option analysis
    const scoredOptions = options.map(option => {
      let score = 5; // baseline score
      
      // Analyze option title for keywords that suggest quality
      const title = option.title.toLowerCase();
      
      // Positive indicators
      if (title.includes('best') || title.includes('premium') || title.includes('top')) score += 2;
      if (title.includes('safe') || title.includes('secure') || title.includes('reliable')) score += 1.5;
      if (title.includes('fast') || title.includes('quick') || title.includes('efficient')) score += 1;
      if (title.includes('free') || title.includes('affordable') || title.includes('cheap')) score += 1;
      if (title.includes('new') || title.includes('innovative') || title.includes('modern')) score += 0.5;
      
      // Negative indicators
      if (title.includes('risky') || title.includes('uncertain') || title.includes('maybe')) score -= 2;
      if (title.includes('expensive') || title.includes('costly') || title.includes('hard')) score -= 1;
      if (title.includes('old') || title.includes('outdated') || title.includes('basic')) score -= 0.5;
      
      // Add slight randomness for variety
      score += (Math.random() * 2) - 1; // +/- 1 random variation
      
      // Ensure score is within bounds
      score = Math.max(1, Math.min(10, score));
      
      return {
        ...option,
        score: Math.round(score * 10) / 10 // Round to 1 decimal place
      };
    });
    
    const topOption = scoredOptions.reduce((best, current) => 
      (current.score || 0) > (best.score || 0) ? current : best
    );

    return {
      recommendation: topOption.title,
      reasoning: `After analyzing the option titles and keywords, ${topOption.title} scored ${topOption.score}/10, making it the recommended choice. The analysis considered factors like reliability, efficiency, cost, and innovation.`,
      riskFactors: ['AI analysis temporarily unavailable', 'Title-based analysis may miss important details'],
      opportunities: ['Research detailed pros and cons for each option', 'Seek expert opinions on top-scoring options'],
      longTermBenefits: [`${topOption.title} shows the most favorable indicators based on analysis`],
      potentialDrawbacks: ['Scores are estimates and should be validated', 'Title-based analysis has limitations'],
      alternativeOptions: ['Enhance top option with features from others', 'Gather more detailed information for precise analysis'],
      confidence: 65,
      uncertaintyAreas: ['AI provider temporarily unavailable', 'Limited to keyword-based analysis'],
      keyFactors: scoredOptions.map((option) => ({
        factor: `${option.title} Quality Score`,
        weight: (option.score || 0) / (scoredOptions.reduce((sum, o) => sum + (o.score || 0), 0)),
        favorsOption: option.title
      })),
      timeHorizon: {
        shortTerm: `Begin with ${topOption.title} (score: ${topOption.score}/10) for immediate needs`,
        mediumTerm: 'Monitor performance and gather detailed feedback',
        longTerm: 'Reassess based on real-world performance data'
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
