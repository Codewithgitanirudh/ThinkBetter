'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDecision } from '@/context/DecisionContext';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, X } from 'lucide-react';
import { AIAnalysis } from '@/types';

export default function AIAssistant() {
  const { currentDecision } = useDecision();
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  console.log(currentDecision, "currentDecision");

  // Real AI analysis function using API
  const generateAIAnalysis = async (): Promise<AIAnalysis> => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decision: currentDecision }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data, "data");
      setIsAnalyzing(false);
      return data.analysis;
    } catch (error) {
      console.error('AI Analysis error:', error);
      setIsAnalyzing(false);
      
      // Fallback analysis if API fails
      return getFallbackAnalysis();
    }
  };

  const getFallbackAnalysis = (): AIAnalysis => {
    const options = currentDecision.options;
    const priorities = currentDecision.priorities || [];
    
    let topOption = options.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    // If priorities are available, calculate weighted scores
    let priorityScores: AIAnalysis['priorityScores'] = undefined;
    
    if (priorities.length > 0) {
      priorityScores = options.map(option => {
        const scores = priorities.map(priority => {
          // Simple heuristic scoring based on pros/cons
          let score = 5; // baseline score
          
          // Check if option has pros/cons related to this priority
          const relatedPros = option.pros.filter(pro => 
            pro.text.toLowerCase().includes(priority.name.toLowerCase())
          );
          const relatedCons = option.cons.filter(con => 
            con.text.toLowerCase().includes(priority.name.toLowerCase())
          );
          
          score += relatedPros.length * 1.5;
          score -= relatedCons.length * 1.5;
          score = Math.max(0, Math.min(10, score)); // Keep within 0-10
          
          return {
            priority: priority.name,
            score: Math.round(score * 10) / 10,
            weightedScore: Math.round((score * priority.weight / 100) * 10) / 10
          };
        });
        
        const totalScore = scores.reduce((sum, s) => sum + s.weightedScore, 0);
        
        return {
          optionId: option.id,
          optionName: option.title,
          scores,
          totalScore: Math.round(totalScore * 10) / 10
        };
      });
      
      // Update recommendation based on priority scores
      const highestScoringOption = priorityScores.reduce((best, current) =>
        current.totalScore > best.totalScore ? current : best
      );
      
      topOption = options.find(o => o.id === highestScoringOption.optionId) || topOption;
    }

    return {
      recommendation: topOption ? topOption.title : "Unable to determine",
      reasoning: priorityScores 
        ? `Based on priority-weighted analysis, ${topOption.title} scores highest. AI analysis temporarily unavailable - using simplified scoring method.`
        : "AI analysis temporarily unavailable. Recommendation based on current scoring.",
      riskFactors: ["AI analysis not available", "Simplified scoring method used", "Manual review recommended"],
      opportunities: ["Consider expert consultation", "Research additional factors", "Try AI analysis later"],
      longTermBenefits: ["Selected option shows favorable indicators"],
      potentialDrawbacks: ["Limited analysis available", "Scoring may not capture all nuances"],
      alternativeOptions: ["Seek additional input", "Delay decision if possible", "Re-run analysis when AI is available"],
      confidence: priorityScores ? 60 : 40,
      uncertaintyAreas: ["AI service unavailable", "Simplified analysis method"],
      keyFactors: [],
      priorityScores,
      timeHorizon: {
        shortTerm: "Proceed with caution using available analysis",
        mediumTerm: "Monitor outcomes and re-analyze when AI available",
        longTerm: "Reassess with full AI analysis"
      }
    };
  };

  const handleAnalyze = async () => {
    if (currentDecision.options.length < 2) return;
    
    const result = await generateAIAnalysis();
    setAnalysis(result);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-primary';
    if (confidence >= 60) return 'text-accent';
    return 'text-accent';
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-darkBg rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ zIndex: 9999 }}
      >
        <Brain size={24} />
        {currentDecision.options.length >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
          >
            <Sparkles size={12} className="text-darkBg" />
          </motion.div>
        )}
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-darkBg bg-opacity-75 z-50"
              onClick={() => setIsOpen(false)}
              style={{ zIndex: 9998 }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[450px] bg-darkSurface shadow-2xl z-50 overflow-y-auto border-l border-darkBg"
              style={{ zIndex: 9999 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Brain size={20} className="text-darkBg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text">AI Assistant</h2>
                      <p className="text-sm text-text">Intelligent decision analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-darkBg rounded-lg transition-colors text-text"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                {currentDecision.options.length < 2 ? (
                  <div className="text-center py-8">
                    <Brain size={48} className="mx-auto text-text mb-4" />
                    <h3 className="text-lg font-medium text-text mb-2">
                      Need More Options
                    </h3>
                    <p className="text-text">
                      Add at least 2 options to get AI analysis and recommendations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Analyze Button */}
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full p-4 bg-primary text-darkBg rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-darkBg"></div>
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Sparkles size={20} />
                          <span>Analyze Decision</span>
                        </div>
                      )}
                    </button>

                    {/* Analysis Results */}
                    {analysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* User Priorities Display */}
                        {currentDecision.priorities && currentDecision.priorities.length > 0 && (
                          <div className="bg-darkBg p-4 rounded-lg border border-accent">
                            <div className="flex items-center space-x-2 mb-4">
                              <TrendingUp size={16} className="text-accent" />
                              <h3 className="font-semibold text-accent">User Priorities</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {currentDecision.priorities.map((priority) => (
                                <div key={priority.id} className="text-center p-3 bg-darkSurface rounded-lg">
                                  <div className="text-accent font-bold text-xl mb-1">
                                    {priority.weight}%
                                  </div>
                                  <div className="text-text font-medium text-sm">{priority.name}</div>
                                  {priority.description && (
                                    <div className="text-text text-xs mt-1">{priority.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendation */}
                        <div className="bg-darkBg p-4 rounded-lg border border-primary">
                          <h4 className="font-semibold text-primary mb-2">📋 AI Recommendation</h4>
                          <p className="text-primary font-medium mb-2">{analysis.recommendation}</p>
                          <p className="text-text text-sm mb-2">{analysis.reasoning}</p>
                          <div className="mt-2">
                            <span className="text-text text-sm">Confidence: </span>
                            <span className={`font-bold ${getConfidenceColor(analysis.confidence)}`}>
                              {analysis.confidence}%
                            </span>
                          </div>
                        </div>

                        {/* Risk Factors */}
                        <div className="bg-darkBg p-4 rounded-lg border border-accent">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle size={16} className="text-accent" />
                            <h3 className="font-semibold text-accent">
                              Risk Factors
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {analysis.riskFactors.map((risk, index) => (
                              <li key={index} className="text-sm text-text flex items-start space-x-2">
                                <span className="text-accent mt-1">•</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="bg-darkBg p-4 rounded-lg border border-primary">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb size={16} className="text-primary" />
                            <h3 className="font-semibold text-primary">
                              Opportunities
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {analysis.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-sm text-text flex items-start space-x-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Long-term Benefits */}
                        {analysis.longTermBenefits && analysis.longTermBenefits.length > 0 && (
                          <div className="bg-darkBg p-4 rounded-lg border border-primary">
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp size={16} className="text-primary" />
                              <h3 className="font-semibold text-primary">
                                Long-term Benefits
                              </h3>
                            </div>
                            <ul className="space-y-1">
                              {analysis.longTermBenefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-text flex items-start space-x-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Time Horizon */}
                        {analysis.timeHorizon && (
                          <div className="bg-darkBg p-4 rounded-lg border border-accent">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles size={16} className="text-accent" />
                              <h3 className="font-semibold text-accent">
                                Time Horizon Analysis
                              </h3>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-accent font-medium">Short-term:</span>
                                <p className="text-sm text-text">{analysis.timeHorizon.shortTerm}</p>
                              </div>
                              <div>
                                <span className="text-accent font-medium">Medium-term:</span>
                                <p className="text-sm text-text">{analysis.timeHorizon.mediumTerm}</p>
                              </div>
                              <div>
                                <span className="text-accent font-medium">Long-term:</span>
                                <p className="text-sm text-text">{analysis.timeHorizon.longTerm}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Priority Scoring Analysis - Enhanced Display */}
                        {analysis.priorityScores && analysis.priorityScores.length > 0 && (
                          <div className="bg-darkBg p-4 rounded-lg border border-primary">
                            <div className="flex items-center space-x-2 mb-4">
                              <TrendingUp size={16} className="text-primary" />
                              <h3 className="font-semibold text-primary">
                                🧮 Priority-Based Scoring
                              </h3>
                            </div>
                            <div className="space-y-4">
                              {analysis.priorityScores.map((optionScore, index) => (
                                <div key={index} className="border border-darkSurface rounded-lg p-3">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-text">{optionScore.optionName}</h4>
                                    <span className="bg-primary text-darkBg px-3 py-1 rounded font-bold text-lg">
                                      {optionScore.totalScore.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2 text-sm">
                                    {optionScore.scores.map((score, scoreIndex) => (
                                      <div key={scoreIndex} className="flex justify-between items-center bg-darkSurface p-2 rounded">
                                        <span className="text-text font-medium">{score.priority}:</span>
                                        <span className="text-primary font-mono">
                                          {score.score}/10 × {currentDecision.priorities?.find(p => p.name === score.priority)?.weight}% = {score.weightedScore.toFixed(1)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Calculation Methodology - How It Works */}
                        {analysis.priorityScores && analysis.priorityScores.length > 0 && (
                          <div className="bg-darkBg p-4 rounded-lg border border-accent">
                            <h4 className="font-semibold text-accent mb-2">🧮 How It Works</h4>
                            <div className="text-sm text-text space-y-2">
                              <p><strong>Step 1:</strong> AI scores each option against each priority (0-10 scale)</p>
                              <p><strong>Step 2:</strong> Multiply score by priority weight (score × weight ÷ 100)</p>
                              <p><strong>Step 3:</strong> Sum all weighted scores for each option</p>
                              <p><strong>Step 4:</strong> Recommend option with highest total score</p>
                              <p><strong>Step 5:</strong> Confidence based on score difference (closer = lower confidence)</p>
                            </div>
                          </div>
                        )}

                        {/* Alternative Options */}
                        {analysis.alternativeOptions && analysis.alternativeOptions.length > 0 && (
                          <div className="bg-darkBg p-4 rounded-lg border border-accent">
                            <div className="flex items-center space-x-2 mb-2">
                              <Lightbulb size={16} className="text-accent" />
                              <h3 className="font-semibold text-accent">
                                Alternative Approaches
                              </h3>
                            </div>
                            <ul className="space-y-1">
                              {analysis.alternativeOptions.map((alt, index) => (
                                <li key={index} className="text-sm text-text flex items-start space-x-2">
                                  <span className="text-accent mt-1">•</span>
                                  <span>{alt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}