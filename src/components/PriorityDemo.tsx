'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Decision, Priority, Option, AIAnalysis } from '@/types';
import { useDecision } from '@/context/DecisionContext';
import { Calculator, TrendingUp, Award, Sparkles, AlertTriangle, Lightbulb, Brain } from 'lucide-react';

export default function PriorityDemo() {
  const { currentDecision } = useDecision();
  const [showDemo, setShowDemo] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        ? `Based on priority-weighted analysis, ${topOption.title} scores highest with the current decision data.`
        : "Analysis based on current scoring.",
      riskFactors: ["Limited data available", "Manual review recommended"],
      opportunities: ["Consider additional factors", "Research more options"],
      longTermBenefits: ["Selected option shows favorable indicators"],
      potentialDrawbacks: ["Scoring may not capture all nuances"],
      alternativeOptions: ["Seek additional input", "Research more factors"],
      confidence: priorityScores ? 75 : 50,
      uncertaintyAreas: ["Additional factors may influence decision"],
      keyFactors: [],
      priorityScores,
      timeHorizon: {
        shortTerm: "Proceed with selected option",
        mediumTerm: "Monitor outcomes and adjust",
        longTerm: "Reassess based on results"
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

  // Check if we have enough data to show analysis
  const hasEnoughData = currentDecision.title && currentDecision.options.length >= 2;

  if (!showDemo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-darkSurface p-6 rounded-xl border border-darkSurface"
      >
        <div className="text-center">
          <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text mb-2">
            Priority-Based AI Analysis
          </h3>
          <p className="text-text mb-4">
            {hasEnoughData 
              ? "Analyze your decision using AI with weighted priorities" 
              : "Add a decision title and at least 2 options to get AI analysis"
            }
          </p>
          <button
            onClick={() => setShowDemo(true)}
            disabled={!hasEnoughData}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:cursor-not-allowed"
          >
            {hasEnoughData ? "Analyze Decision" : "Need More Data"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Analysis Header */}
      <div className="bg-darkSurface p-6 rounded-xl border border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">
              {currentDecision.title}
            </h2>
            <p className="text-text">
              AI Analysis: {currentDecision.options.length} options to analyze
            </p>
          </div>
          <div className="flex space-x-2">
            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-darkBg"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles size={16} />
                    <span>Analyze</span>
                  </div>
                )}
              </button>
            )}
            <button
              onClick={() => setShowDemo(false)}
              className="px-4 py-2 bg-darkBg text-text rounded-lg hover:bg-darkBg/80 transition-colors"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Priorities */}
      {currentDecision.priorities && currentDecision.priorities.length > 0 && (
        <div className="bg-darkSurface p-6 rounded-xl border border-accent">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp size={20} className="text-accent" />
            <h3 className="text-xl font-bold text-accent">User Priorities</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentDecision.priorities.map((priority) => (
              <div key={priority.id} className="text-center p-3 bg-darkBg rounded-lg">
                <div className="text-accent font-bold text-2xl mb-1">
                  {priority.weight}%
                </div>
                <div className="text-text font-medium">{priority.name}</div>
                {priority.description && (
                  <div className="text-text text-xs mt-1">{priority.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentDecision.options.map((option) => (
          <div key={option.id} className="bg-darkSurface p-6 rounded-xl border border-darkSurface">
            <h4 className="text-lg font-bold text-text mb-3">{option.title}</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-primary font-medium mb-2">Pros ({option.pros.length})</h5>
                {option.pros.length > 0 ? (
                  <ul className="space-y-1">
                    {option.pros.map((pro) => (
                      <li key={pro.id} className="text-sm text-text flex items-start space-x-2">
                        <span className="text-primary mt-1">+</span>
                        <span>{pro.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No pros listed yet</p>
                )}
              </div>
              
              <div>
                <h5 className="text-accent font-medium mb-2">Cons ({option.cons.length})</h5>
                {option.cons.length > 0 ? (
                  <ul className="space-y-1">
                    {option.cons.map((con) => (
                      <li key={con.id} className="text-sm text-text flex items-start space-x-2">
                        <span className="text-accent mt-1">-</span>
                        <span>{con.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No cons listed yet</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis Results */}
      {analysis ? (
        <div className="bg-darkSurface p-6 rounded-xl border border-primary">
          <div className="flex items-center space-x-2 mb-4">
            <Award size={20} className="text-primary" />
            <h3 className="text-xl font-bold text-primary">AI Analysis Results</h3>
          </div>

          {/* Recommendation */}
          <div className="bg-darkBg p-4 rounded-lg mb-4 border border-primary">
            <h4 className="font-semibold text-primary mb-2">📋 Recommendation</h4>
            <p className="text-primary font-medium mb-2">{analysis.recommendation}</p>
            <p className="text-text text-sm">{analysis.reasoning}</p>
            <div className="mt-2">
              <span className="text-text text-sm">Confidence: </span>
              <span className={`font-bold ${getConfidenceColor(analysis.confidence)}`}>
                {analysis.confidence}%
              </span>
            </div>
          </div>

          {/* Priority Scoring */}
          {analysis.priorityScores && analysis.priorityScores.length > 0 && (
            <div className="bg-darkBg p-4 rounded-lg mb-4 border border-primary">
              <h4 className="font-semibold text-primary mb-4">🧮 Priority-Based Scoring</h4>
              <div className="space-y-4">
                {analysis.priorityScores.map((optionScore, index) => (
                  <div key={index} className="border border-darkSurface rounded-lg p-3">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-text">{optionScore.optionName}</h5>
                      <span className="bg-primary text-darkBg px-3 py-1 rounded font-bold text-lg">
                        {optionScore.totalScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
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

          {/* Risk Factors */}
          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <div className="bg-darkBg p-4 rounded-lg mb-4 border border-accent">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle size={16} className="text-accent" />
                <h4 className="font-semibold text-accent">Risk Factors</h4>
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
          )}

          {/* Opportunities */}
          {analysis.opportunities && analysis.opportunities.length > 0 && (
            <div className="bg-darkBg p-4 rounded-lg mb-4 border border-primary">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb size={16} className="text-primary" />
                <h4 className="font-semibold text-primary">Opportunities</h4>
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
          )}

          {/* Calculation Breakdown */}
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
        </div>
      ) : (
        <div className="bg-darkSurface p-6 rounded-xl border border-darkSurface">
          <div className="text-center py-8">
            <Brain size={48} className="mx-auto text-text mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">
              Ready for AI Analysis
            </h3>
            <p className="text-text">
              Click "Analyze" button above to get AI-powered insights on your decision.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
