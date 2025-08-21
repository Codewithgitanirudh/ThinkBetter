// import { Decision, Priority, Option, AIAnalysis } from '@/types';

// /**
//  * Test function demonstrating the enhanced AI analysis
//  * Based on your Work From Office vs Work From Home example
//  */
// export function createTestDecision(): Decision {
//   const priorities: Priority[] = [
//     { id: '1', name: 'Flexibility', weight: 40, description: 'Ability to manage work-life balance' },
//     { id: '2', name: 'Cost', weight: 25, description: 'Financial impact of the decision' },
//     { id: '3', name: 'Networking', weight: 20, description: 'Professional relationship building' },
//     { id: '4', name: 'Productivity', weight: 15, description: 'Work output and efficiency' }
//   ];

//   const options: Option[] = [
//     {
//       id: 'wfo',
//       title: 'Work From Office',
//       score: 2,
//       // pros: [
//       //   { id: '1', text: 'More networking opportunities' },
//       //   { id: '2', text: 'Better focus and structure' },
//       //   { id: '3', text: 'Face-to-face collaboration' },
//       //   { id: '4', text: 'Clear work-life separation' }
//       // ],
//       // cons: [
//       //   { id: '1', text: 'Daily commute time' },
//       //   { id: '2', text: 'Higher costs (transport, meals)' },
//       //   { id: '3', text: 'Less flexible schedule' },
//       //   { id: '4', text: 'Office distractions' }
//       // ],
//       //    score: 2 // pros - cons = 4 - 4 = 0, but let's set a basic score
//     },
//     {
//       id: 'wfh',
//       title: 'Work From Home',
//       score: 2,
//       // pros: [
//       //   { id: '1', text: 'Maximum flexibility' },
//       //   { id: '2', text: 'Significant cost savings' },
//       //   { id: '3', text: 'No commute stress' },
//       //   { id: '4', text: 'Comfortable environment' }
//       // ],
//       // cons: [
//       //   { id: '1', text: 'Social isolation' },
//       //   { id: '2', text: 'Less visibility to managers' },
//       //   { id: '3', text: 'Home distractions' },
//       //   { id: '4', text: 'Harder to separate work-life' }
//       // ],
//       //  score: 0 // pros - cons = 4 - 4 = 0
//     }
//   ];

//   return {
//     id: 'test-decision',
//     title: 'Work Location Decision',
//     options,
//     priorities,
//     timestamp: new Date(),
//     selectedOptionId: undefined
//   };
// }

// /**
//  * Example of how the AI should analyze with priority scoring
//  */
// export function getExpectedAnalysis(): AIAnalysis {
//   return {
//     recommendation: 'Work From Home',
//     reasoning: 'Based on weighted priority analysis, Work From Home scores 67.5 vs Work From Office at 65.5. The high weight on Flexibility (40%) strongly favors WFH, and significant cost savings provide additional advantage despite lower networking opportunities.',
//     riskFactors: [
//       'Social isolation may impact mental health and team cohesion',
//       'Reduced visibility might affect career advancement',
//       'Home distractions could impact productivity'
//     ],
//     opportunities: [
//       'Higher flexibility enables better work-life balance',
//       'Cost savings can be invested in professional development',
//       'Develop strong self-management and digital communication skills'
//     ],
//     longTermBenefits: [
//       'Improved work-life balance leading to better performance',
//       'Significant financial savings over time',
//       'Enhanced digital collaboration skills'
//     ],
//     potentialDrawbacks: [
//       'May miss out on spontaneous networking opportunities',
//       'Potential for career advancement challenges',
//       'Requires strong self-discipline'
//     ],
//     alternativeOptions: [
//       'Hybrid model: 2-3 days WFH, 2-3 days office',
//       'Flexible start with monthly evaluation',
//       'Trial period of 3 months before permanent decision'
//     ],
//     confidence: 75, // Moderate confidence due to close scores (67.5 vs 65.5)
//     uncertaintyAreas: [
//       'Long-term career impact of reduced office presence',
//       'Company culture and promotion policies',
//       'Personal discipline and productivity patterns'
//     ],
//     keyFactors: [
//       {
//         factor: 'Flexibility',
//         weight: 0.4,
//         favorsOption: 'Work From Home'
//       },
//       {
//         factor: 'Cost Efficiency',
//         weight: 0.25,
//         favorsOption: 'Work From Home'
//       },
//       {
//         factor: 'Professional Networking',
//         weight: 0.2,
//         favorsOption: 'Work From Office'
//       }
//     ],
//     priorityScores: [
//       {
//         optionId: 'wfh',
//         optionName: 'Work From Home',
//         scores: [
//           { priority: 'Flexibility', score: 9, weightedScore: 36.0 }, // 9 × 40% = 36
//           { priority: 'Cost', score: 9, weightedScore: 22.5 }, // 9 × 25% = 22.5
//           { priority: 'Networking', score: 3, weightedScore: 6.0 }, // 3 × 20% = 6
//           { priority: 'Productivity', score: 6, weightedScore: 9.0 } // 6 × 15% = 9
//         ],
//         totalScore: 73.5
//       },
//       {
//         optionId: 'wfo',
//         optionName: 'Work From Office',
//         scores: [
//           { priority: 'Flexibility', score: 4, weightedScore: 16.0 }, // 4 × 40% = 16
//           { priority: 'Cost', score: 4, weightedScore: 10.0 }, // 4 × 25% = 10
//           { priority: 'Networking', score: 8, weightedScore: 16.0 }, // 8 × 20% = 16
//           { priority: 'Productivity', score: 7, weightedScore: 10.5 } // 7 × 15% = 10.5
//         ],
//         totalScore: 52.5
//       }
//     ],
//     timeHorizon: {
//       shortTerm: 'Immediate cost savings and flexibility benefits, initial adjustment period',
//       mediumTerm: 'Established remote work routines, potential career impact assessment',
//       longTerm: 'Career progression evaluation, long-term financial benefits realization'
//     }
//   };
// }

// /**
//  * Function to validate if AI analysis follows the priority-based approach
//  */
// export function validatePriorityAnalysis(analysis: AIAnalysis, decision: Decision): boolean {
//   if (!analysis.priorityScores || !decision.priorities) {
//     return false;
//   }

//   // Check if all options are scored
//   const expectedOptions = decision.options.length;
//   const scoredOptions = analysis.priorityScores.length;
  
//   if (expectedOptions !== scoredOptions) {
//     return false;
//   }

//   // Check if all priorities are considered
//   const expectedPriorities = decision.priorities.map(p => p.name);
  
//   for (const optionScore of analysis.priorityScores) {
//     const scoredPriorities = optionScore.scores.map(s => s.priority);
    
//     for (const expectedPriority of expectedPriorities) {
//       if (!scoredPriorities.includes(expectedPriority)) {
//         return false;
//       }
//     }
//   }

//   return true;
// }
