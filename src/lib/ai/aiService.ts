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
    console.log(decision, "decision");
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

    const topOption = options.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    const avgScore = options.reduce((sum, opt) => sum + opt.score, 0) / options.length;
    const scoreSpread = Math.max(...options.map(o => o.score)) - Math.min(...options.map(o => o.score));

    return {
      recommendation: topOption.title,
      reasoning: `Based on the current scoring system, ${topOption.title} has the highest score (${topOption.score}). This option has ${topOption.pros.length} identified advantages and ${topOption.cons.length} potential concerns.`,
      riskFactors: [
        scoreSpread < 2 ? 'Options are very close in score - decision may be sensitive to new information' : '',
        topOption.cons.length > topOption.pros.length ? 'Recommended option has more cons than pros' : '',
        'AI analysis is not available - consider seeking expert advice'
      ].filter(Boolean),
      opportunities: [
        'Research additional factors for each option',
        'Seek input from stakeholders or experts',
        'Consider implementing the decision in phases'
      ],
      longTermBenefits: [
        'Selected option shows the most favorable immediate indicators',
        'Decision process itself provides valuable experience'
      ],
      potentialDrawbacks: [
        'Analysis is based on limited automated scoring',
        'Important qualitative factors may not be captured'
      ],
      alternativeOptions: [
        'Combine elements from multiple options',
        'Delay decision to gather more information',
        'Start with a pilot or trial approach'
      ],
      confidence: Math.min(85, 50 + (scoreSpread * 5)),
      uncertaintyAreas: [
        'AI provider not available',
        'Incomplete factor analysis',
        'Subjective scoring system'
      ],
      keyFactors: options.map((option, index) => ({
        factor: `Option ${index + 1} Score`,
        weight: 1 / options.length,
        favorsOption: option.title
      })),
      timeHorizon: {
        shortTerm: 'Begin implementation of highest-scoring option',
        mediumTerm: 'Monitor results and gather feedback',
        longTerm: 'Evaluate decision effectiveness and learn for future decisions'
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
      if (option.pros.length < 2) {
        suggestions.push({
          id: `fallback-pros-${index}`,
          type: 'question',
          content: `What additional benefits does ${option.title} offer?`,
          confidence: 80,
          optionId: option.id,
          importance: 'medium'
        });
      }

      if (option.cons.length < 2) {
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
