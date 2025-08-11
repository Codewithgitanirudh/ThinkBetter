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

  // Mock AI analysis function (replace with actual AI service)
  const generateAIAnalysis = async (): Promise<AIAnalysis> => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const options = currentDecision.options;
    const highestScore = Math.max(...options.map(o => o.score));
    const topOption = options.find(o => o.score === highestScore);
    
    // Mock AI analysis based on current decision
    const mockAnalysis: AIAnalysis = {
      recommendation: topOption ? topOption.title : "Consider gathering more information",
      reasoning: `Based on the pros and cons analysis, ${topOption?.title || 'the top option'} has the highest score of ${highestScore}. This suggests it has the most favorable balance of positive and negative factors.`,
      riskFactors: [
        "Consider long-term implications beyond immediate pros/cons",
        "Verify that all important factors have been considered",
        "Check for potential biases in your evaluation"
      ],
      opportunities: [
        "This decision could open new pathways for growth",
        "Consider combining elements from multiple options",
        "Think about how this aligns with your long-term goals"
      ],
      confidence: Math.min(95, Math.max(60, 60 + (options.length * 10) + (highestScore * 5)))
    };
    
    setIsAnalyzing(false);
    return mockAnalysis;
  };

  const handleAnalyze = async () => {
    if (currentDecision.options.length < 2) return;
    
    const result = await generateAIAnalysis();
    setAnalysis(result);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={currentDecision.options.length < 2}
      >
        <Brain size={24} />
        {currentDecision.options.length >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <Sparkles size={12} className="text-white" />
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
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                      <Brain size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Assistant</h2>
                      <p className="text-sm text-gray-500">Intelligent decision analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                {currentDecision.options.length < 2 ? (
                  <div className="text-center py-8">
                    <Brain size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Need More Options
                    </h3>
                    <p className="text-gray-500">
                      Add at least 2 options to get AI analysis and recommendations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Analyze Button */}
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
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
                        {/* Recommendation */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp size={16} className="text-blue-600" />
                            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                              AI Recommendation
                            </h3>
                          </div>
                          <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                            {analysis.recommendation}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {analysis.reasoning}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-sm text-blue-600">Confidence:</span>
                            <span className={`font-bold ${getConfidenceColor(analysis.confidence)}`}>
                              {analysis.confidence}%
                            </span>
                          </div>
                        </div>

                        {/* Risk Factors */}
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle size={16} className="text-red-600" />
                            <h3 className="font-semibold text-red-800 dark:text-red-200">
                              Risk Factors
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {analysis.riskFactors.map((risk, index) => (
                              <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start space-x-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb size={16} className="text-green-600" />
                            <h3 className="font-semibold text-green-800 dark:text-green-200">
                              Opportunities
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {analysis.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start space-x-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
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