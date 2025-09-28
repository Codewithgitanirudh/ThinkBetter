import { AIProvider, AIConfig, Decision, AIAnalysis, AISuggestion } from '@/types';
import { GroqProvider } from './providers/groq';
import { HuggingFaceProvider } from './providers/huggingface';
import { GeminiProvider } from './providers/gemini';

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private currentProvider: AIProvider | null = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize providers with environment variables
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const hfKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (groqKey) {
      this.providers.set('groq', new GroqProvider(groqKey));
    }

    if (hfKey) {
      this.providers.set('huggingface', new HuggingFaceProvider(hfKey));
    }

    if (geminiKey) {
      this.providers.set('gemini', new GeminiProvider(geminiKey));
    }

    // Set default provider (fallback order: Groq -> Gemini -> HuggingFace)
    this.currentProvider = 
      this.providers.get('groq') || 
      this.providers.get('gemini') || 
      this.providers.get('huggingface') || 
      null;
  }

  setProvider(providerName: string): boolean {
    const provider = this.providers.get(providerName);
    if (provider) {
      this.currentProvider = provider;
      return true;
    }
    return false;
  }

  getCurrentProvider(): string {
    return this.currentProvider?.name || 'None';
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async analyzeDecision(decision: Decision): Promise<AIAnalysis> {

    if (!this.currentProvider) {
      return this.getFallbackAnalysis(decision);
    }

    try {
      return await this.currentProvider.analyze(decision);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return this.getFallbackAnalysis(decision);
    }
  }

  async generateSuggestions(decision: Decision): Promise<AISuggestion[]> {

    if (!this.currentProvider) {
      return this.getFallbackSuggestions(decision);
    }

    try {
      return await this.currentProvider.generateSuggestions(decision);
    } catch (error) {
      console.error('AI Suggestions failed:', error);
      return this.getFallbackSuggestions(decision);
    }
  }

  async enhanceOption(option: { title: string; pros: string[]; cons: string[] }) {
    // This could be expanded to use AI for option enhancement
    return {
      additionalPros: [],
      additionalCons: [],
      modifications: [],
      questions: []
    };
  }

  private getFallbackAnalysis(decision: Decision): AIAnalysis {
    const options = decision.options;
    if (options.length === 0) {
      return {
        recommendation: 'No options available to analyze',
        reasoning: 'Please add options to your decision to receive analysis',
        riskFactors: ['No options to evaluate'],
        opportunities: ['Add options to begin analysis'],
        longTermBenefits: [],
        potentialDrawbacks: [],
        alternativeOptions: [],
        confidence: 0,
        uncertaintyAreas: ['Complete lack of data'],
        keyFactors: [],
        timeHorizon: {
          shortTerm: 'Add decision options',
          mediumTerm: 'Gather more information',
          longTerm: 'Develop decision framework'
        }
      };
    }

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

    const avgScore = scoredOptions.reduce((sum, opt) => sum + (opt.score || 0), 0) / scoredOptions.length;
    const scoreSpread = Math.max(...scoredOptions.map(o => o.score || 0)) - Math.min(...scoredOptions.map(o => o.score || 0));

    return {
      recommendation: topOption.title,
      reasoning: `After analyzing the option titles and keywords, ${topOption.title} scored ${topOption.score}/10, making it the recommended choice. The analysis considered factors like reliability, efficiency, cost, and innovation.`,
      riskFactors: [
        scoreSpread < 2 ? `Close scores (spread: ${scoreSpread.toFixed(1)}) suggest options are similar - consider additional factors` : '',
        'Analysis based on option titles - detailed evaluation recommended'
      ].filter(Boolean),
      opportunities: [
        'Research detailed pros and cons for each option',
        'Seek expert opinions on top-scoring options',
        'Consider combining elements from multiple options'
      ],
      longTermBenefits: [
        `${topOption.title} shows the most favorable indicators based on analysis`,
        'Systematic scoring approach provides objective comparison'
      ],
      potentialDrawbacks: [
        'Title-based analysis may miss important details',
        'Scores are estimates and should be validated'
      ],
      alternativeOptions: [
        'Enhance top option with features from others',
        'Gather more detailed information for precise analysis',
        scoreSpread < 1.5 ? 'Since scores are close, consider hybrid approach' : ''
      ].filter(Boolean),
      confidence: Math.min(85, Math.max(40, 50 + (scoreSpread * 10) + (avgScore * 5))),
      uncertaintyAreas: [
        'AI provider not available',
        'Limited to keyword-based analysis',
        scoreSpread < 2 ? 'Options are very similar in scoring' : ''
      ].filter(Boolean),
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
    const suggestions: AISuggestion[] = [
      {
        id: 'fallback-criteria',
        type: 'question',
        content: 'What are the most important criteria for this decision?',
        confidence: 90,
        importance: 'high'
      },
      {
        id: 'fallback-timeline',
        type: 'question',
        content: 'What is the timeline for implementing this decision?',
        confidence: 85,
        importance: 'medium'
      },
      {
        id: 'fallback-stakeholders',
        type: 'insight',
        content: 'Consider how this decision affects all stakeholders',
        confidence: 95,
        importance: 'high'
      }
    ];

    // Add suggestions based on decision options
    decision.options.forEach((option, index) => {
      if (option.score && option.score > 2) {
        suggestions.push({
          id: `fallback-pros-${index}`,
          type: 'question',
          content: `What additional benefits does ${option.title} offer?`,
          confidence: 80,
          optionId: option.id,
          importance: 'medium'
        });
      }

      if (option.score && option.score > 2) {
        suggestions.push({
          id: `fallback-cons-${index}`,
          type: 'question',
          content: `What potential risks or drawbacks should be considered for ${option.title}?`,
          confidence: 80,
          optionId: option.id,
          importance: 'medium'
        });
      }
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }
}

// Singleton instance
export const aiService = new AIService();
