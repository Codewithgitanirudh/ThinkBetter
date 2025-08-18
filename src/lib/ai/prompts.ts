import { Decision } from '@/types';

export class AIPrompts {
  static createAnalysisPrompt(decision: Decision): string {
    const optionsText = decision.options.map((option, index) => {
      const prosText = option.pros.map(pro => `+ ${pro.text}`).join('\n');
      const consText = option.cons.map(con => `- ${con.text}`).join('\n');
      
      return `Option ${index + 1}: ${option.title}
Pros:
${prosText || '(No pros listed)'}
Cons:
${consText || '(No cons listed)'}
Current Score: ${option.score}`;
    }).join('\n\n');

    const prioritiesText = decision.priorities && decision.priorities.length > 0 
      ? `\nUSER PRIORITIES (with weights):
${decision.priorities.map(p => `- ${p.name}: ${p.weight}%${p.description ? ` (${p.description})` : ''}`).join('\n')}`
      : '';

    return `You are an expert decision analyst. Analyze this decision thoroughly and provide comprehensive insights.

DECISION: ${decision.title}

OPTIONS:
${optionsText}${prioritiesText}

${decision.priorities && decision.priorities.length > 0 ? `
PRIORITY SCORING INSTRUCTIONS:
1. Score each option against each priority (0-10 scale)
2. Multiply score by priority weight to get weighted score
3. Sum weighted scores for total option score
4. Recommend option with highest total score
5. Base confidence on score differences (close scores = lower confidence)

` : ''}Please provide a detailed analysis in the following JSON format:
{
  "recommendation": "The best option with clear reasoning",
  "reasoning": "Detailed explanation of why this option is recommended",
  "riskFactors": ["List of potential risks and concerns"],
  "opportunities": ["List of potential opportunities and benefits"],
  "longTermBenefits": ["Long-term advantages of the recommended option"],
  "potentialDrawbacks": ["Potential negative aspects to consider"],
  "alternativeOptions": ["Suggestions for alternatives or modifications"],
  "confidence": 85,
  "uncertaintyAreas": ["Areas where more information might be needed"],
  "keyFactors": [
    {
      "factor": "Most important decision factor",
      "weight": 0.3,
      "favorsOption": "Option name that this factor favors"
    }
  ],${decision.priorities && decision.priorities.length > 0 ? `
  "priorityScores": [
    {
      "optionId": "option-id",
      "optionName": "Option Name",
      "scores": [
        {
          "priority": "Priority Name",
          "score": 8,
          "weightedScore": 32
        }
      ],
      "totalScore": 85.5
    }
  ],` : ''}
  "timeHorizon": {
    "shortTerm": "Impact in the next 1-6 months",
    "mediumTerm": "Impact in the next 6-24 months", 
    "longTerm": "Impact beyond 2 years"
  }
}

Focus on:
1. ${decision.priorities && decision.priorities.length > 0 ? 'Score each option against user priorities using 0-10 scale' : 'Weighing pros and cons objectively'}
2. ${decision.priorities && decision.priorities.length > 0 ? 'Calculate weighted scores (score × weight ÷ 100)' : 'Considering long-term implications'}
3. ${decision.priorities && decision.priorities.length > 0 ? 'Base recommendation on highest total weighted score' : 'Identifying hidden risks or opportunities'}
4. ${decision.priorities && decision.priorities.length > 0 ? 'Explain scoring rationale for each priority' : 'Suggesting improvements to existing options'}
5. Providing actionable insights
6. Being realistic about confidence levels (closer scores = lower confidence)

${decision.priorities && decision.priorities.length > 0 ? `
EXAMPLE SCORING:
Option A: Flexibility(8×40%=32) + Cost(6×25%=15) + Networking(4×20%=8) + Productivity(7×15%=10.5) = Total: 65.5
Option B: Flexibility(5×40%=20) + Cost(9×25%=22.5) + Networking(8×20%=16) + Productivity(6×15%=9) = Total: 67.5
→ Recommend Option B (higher score)

` : ''}Return only valid JSON.`;
  }

  static createSuggestionsPrompt(decision: Decision): string {
    const optionsText = decision.options.map((option, index) => {
      return `Option ${index + 1}: ${option.title}
Pros: ${option.pros.map(p => p.text).join(', ')}
Cons: ${option.cons.map(c => c.text).join(', ')}`;
    }).join('\n');

    return `You are a decision-making assistant. Generate helpful suggestions for this decision.

DECISION: ${decision.title}
OPTIONS:
${optionsText}

Generate 5-8 suggestions in the following JSON format:
[
  {
    "id": "unique-id",
    "type": "pro|con|insight|alternative|warning|question",
    "content": "Specific, actionable suggestion",
    "confidence": 75,
    "optionId": "option-id-if-applicable",
    "importance": "low|medium|high"
  }
]

Types explained:
- "pro": Additional positive aspect to consider
- "con": Additional negative aspect to consider  
- "insight": Important factor or perspective
- "alternative": New option or modification
- "warning": Potential pitfall or risk
- "question": Important question to investigate

Focus on:
1. Uncovering overlooked factors
2. Suggesting additional pros/cons
3. Identifying critical questions
4. Proposing alternative approaches
5. Highlighting potential risks

Return only valid JSON array.`;
  }

  static createOptionEnhancementPrompt(option: { title: string; pros: string[]; cons: string[] }): string {
    return `Analyze this decision option and suggest improvements:

OPTION: ${option.title}
Current Pros: ${option.pros.join(', ')}
Current Cons: ${option.cons.join(', ')}

Suggest additional pros and cons in JSON format:
{
  "additionalPros": ["List of potential positive aspects not yet considered"],
  "additionalCons": ["List of potential negative aspects not yet considered"],
  "modifications": ["Suggestions to improve this option"],
  "questions": ["Important questions to research about this option"]
}

Return only valid JSON.`;
  }
}
