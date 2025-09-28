"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDecision } from "@/context/DecisionContext";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  X,
} from "lucide-react";

export default function AIAssistant() {
  const { currentDecision, isopen, setIsopen, analysis } = useDecision();
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-primary";
    if (confidence >= 60) return "text-accent";
    return "text-accent";
  };

  useEffect(() => {
    if (isopen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isopen]);

  if (!isopen) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsopen(true)}
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

      <AnimatePresence>
        {isopen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 "
              onClick={() => setIsopen(false)}
              style={{ zIndex: 9998 }}
            />

            {/* Popup Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[90%] md:max-w-5xl bg-gray-800 rounded-2xl shadow-2xl z-50 max-h-[80vh] border border-gray-700 overflow-hidden md:mr-10"
              style={{ zIndex: 9999 }}
            >
              <div className="p-4 md:p-6">
                {/* Header */}
                <div className="sticky top-10 z-50 bg-dark-800 flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Brain size={20} className="text-darkBg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        AI Assistant
                      </h2>
                      <p className="text-sm text-gray-400">
                        Intelligent decision analysis
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsopen(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                {analysis === null ? (
                  <div className="text-center py-8">
                  <div className="h-12 w-12 mx-auto bg-gray-700 rounded-full mb-4 animate-pulse" />
                  <div className="h-6 w-3/5 mx-auto bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-2/5 mx-auto bg-gray-700 rounded animate-pulse" />
                </div>
                ) : (
                  <div className="space-y-6 overflow-y-auto max-h-[62vh] md:max-h-[67vh] pr-3 md:pr-5 mt-10">
                    {/* Analysis Results */}
                    {analysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* User Priorities Display */}
                        {currentDecision.priorities &&
                          currentDecision.priorities.length > 0 && (
                            <div className="bg-gray-700 p-4 rounded-lg border border-accent">
                              <div className="flex items-center space-x-2 mb-4">
                                <TrendingUp size={16} className="text-accent" />
                                <h3 className="font-semibold text-accent">
                                  User Priorities
                                </h3>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {currentDecision.priorities.map((priority) => (
                                  <div
                                    key={priority.id}
                                    className="text-center p-3 bg-gray-800 rounded-lg"
                                  >
                                    <div className="text-accent font-bold text-xl mb-1">
                                      {priority.weight}%
                                    </div>
                                    <div className="text-white font-medium text-sm">
                                      {priority.name}
                                    </div>
                                    {priority.description && (
                                      <div className="text-gray-400 text-xs mt-1">
                                        {priority.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Recommendation */}
                        <div className="bg-gray-700 p-4 rounded-lg border border-primary">
                          <h4 className="font-semibold text-primary mb-2">
                            📋 AI Recommendation
                          </h4>
                          <p className="text-primary font-medium mb-2">
                            {analysis.recommendation}
                          </p>
                          <p className="text-gray-400 text-sm mb-2">
                            {analysis.reasoning}
                          </p>
                          <div className="mt-2">
                            <span className="text-gray-400 text-sm">
                              Confidence:{" "}
                            </span>
                            <span
                              className={`font-bold ${getConfidenceColor(
                                analysis.confidence
                              )}`}
                            >
                              {analysis.confidence}%
                            </span>
                          </div>
                        </div>

                        {/* Risk Factors */}
                        <div className="bg-gray-700 p-4 rounded-lg border border-accent">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle size={16} className="text-accent" />
                            <h3 className="font-semibold text-accent">
                              Negative Factors
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {analysis.riskFactors.map((risk, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-400 flex items-start space-x-2"
                              >
                                <span className="text-accent mt-1">•</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="bg-gray-700 p-4 rounded-lg border border-primary">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb size={16} className="text-primary" />
                            <h3 className="font-semibold text-primary">
                              Positive Factors
                            </h3>
                          </div>
                          <ul className="space-y-1">
                            {analysis.opportunities.map(
                              (opportunity, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-400 flex items-start space-x-2"
                                >
                                  <span className="text-primary mt-1">•</span>
                                  <span>{opportunity}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Long-term Benefits */}
                        {analysis.longTermBenefits &&
                          analysis.longTermBenefits.length > 0 && (
                            <div className="bg-gray-700 p-4 rounded-lg border border-primary">
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp
                                  size={16}
                                  className="text-primary"
                                />
                                <h3 className="font-semibold text-primary">
                                  Long-term Benefits
                                </h3>
                              </div>
                              <ul className="space-y-1">
                                {analysis.longTermBenefits.map(
                                  (benefit, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-400 flex items-start space-x-2"
                                    >
                                      <span className="text-primary mt-1">
                                        •
                                      </span>
                                      <span>{benefit}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Time Horizon */}
                        {analysis.timeHorizon && (
                          <div className="bg-gray-700 p-4 rounded-lg border border-accent">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles size={16} className="text-accent" />
                              <h3 className="font-semibold text-accent">
                                Time Horizon Analysis
                              </h3>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-accent font-medium">
                                  Short-term:
                                </span>
                                <p className="text-sm text-gray-400">
                                  {analysis.timeHorizon.shortTerm}
                                </p>
                              </div>
                              <div>
                                <span className="text-accent font-medium">
                                  Medium-term:
                                </span>
                                <p className="text-sm text-gray-400">
                                  {analysis.timeHorizon.mediumTerm}
                                </p>
                              </div>
                              <div>
                                <span className="text-accent font-medium">
                                  Long-term:
                                </span>
                                <p className="text-sm text-gray-400">
                                  {analysis.timeHorizon.longTerm}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Priority Scoring Analysis */}
                        {analysis.priorityScores &&
                          analysis.priorityScores.length > 0 && (
                            <div className="bg-gray-700 p-4 rounded-lg border border-primary">
                              <div className="flex items-center space-x-2 mb-4">
                                <TrendingUp
                                  size={16}
                                  className="text-primary"
                                />
                                <h3 className="font-semibold text-primary">
                                  🧮 Priority-Based Scoring
                                </h3>
                              </div>
                              <div className="space-y-4">
                                {analysis.priorityScores.map(
                                  (optionScore, index) => (
                                    <div
                                      key={index}
                                      className="border border-gray-800 rounded-lg p-3"
                                    >
                                      <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-white">
                                          {optionScore.optionName}
                                        </h4>
                                        <span className="bg-primary text-darkBg px-3 py-1 rounded font-bold text-lg">
                                          {optionScore.totalScore.toFixed(1)}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-1 gap-2 text-sm">
                                        {optionScore.scores.map(
                                          (score, scoreIndex) => (
                                            <div
                                              key={scoreIndex}
                                              className="flex justify-between items-center bg-gray-800 p-2 rounded"
                                            >
                                              <span className="text-white font-medium">
                                                {score.priority}:
                                              </span>
                                              <span className="text-primary font-mono">
                                                {score.score}/10 ×{" "}
                                                {
                                                  currentDecision.priorities?.find(
                                                    (p) =>
                                                      p.name === score.priority
                                                  )?.weight
                                                }
                                                % ={" "}
                                                {score.weightedScore.toFixed(1)}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Calculation Methodology */}
                        {analysis.priorityScores &&
                          analysis.priorityScores.length > 0 && (
                            <div className="bg-gray-700 p-4 rounded-lg border border-accent">
                              <h4 className="font-semibold text-accent mb-2">
                                🧮 How It Works
                              </h4>
                              <div className="text-sm text-gray-400 space-y-2">
                                <p>
                                  <strong>Step 1:</strong> AI scores each option
                                  against each priority (0-10 scale)
                                </p>
                                <p>
                                  <strong>Step 2:</strong> Multiply score by
                                  priority weight (score × weight ÷ 100)
                                </p>
                                <p>
                                  <strong>Step 3:</strong> Sum all weighted
                                  scores for each option
                                </p>
                                <p>
                                  <strong>Step 4:</strong> Recommend option with
                                  highest total score
                                </p>
                                <p>
                                  <strong>Step 5:</strong> Confidence based on
                                  score difference (closer = lower confidence)
                                </p>
                              </div>
                            </div>
                          )}

                        {/* Alternative Options */}
                        {analysis.alternativeOptions &&
                          analysis.alternativeOptions.length > 0 && (
                            <div className="bg-gray-700 p-4 rounded-lg border border-accent">
                              <div className="flex items-center space-x-2 mb-2">
                                <Lightbulb size={16} className="text-accent" />
                                <h3 className="font-semibold text-accent">
                                  Alternative Approaches
                                </h3>
                              </div>
                              <ul className="space-y-1">
                                {analysis.alternativeOptions.map(
                                  (alt, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-400 flex items-start space-x-2"
                                    >
                                      <span className="text-accent mt-1">
                                        •
                                      </span>
                                      <span>{alt}</span>
                                    </li>
                                  )
                                )}
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
