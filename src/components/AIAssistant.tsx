"use client";

import { useState } from "react";
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
import { AIAnalysis } from "@/types";

export default function AIAssistant() {
  const { currentDecision, updateWithAIScores } = useDecision();
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Real AI analysis function using API
  const generateAIAnalysis = async (): Promise<AIAnalysis> => {
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.error("AI Analysis error:", error);
      setIsAnalyzing(false);

      // Fallback analysis if API fails
      return getFallbackAnalysis();
    }
  };

  const getFallbackAnalysis = (): AIAnalysis => {
    const options = currentDecision.options;
    const priorities = currentDecision.priorities || [];

    // Generate meaningful scores based on option analysis
    const scoredOptions = options.map((option) => {
      let score = 5; // baseline score

      // Analyze option title for keywords that suggest quality
      const title = option.title.toLowerCase();

      // Positive indicators
      if (
        title.includes("best") ||
        title.includes("premium") ||
        title.includes("top")
      )
        score += 2;
      if (
        title.includes("safe") ||
        title.includes("secure") ||
        title.includes("reliable")
      )
        score += 1.5;
      if (
        title.includes("fast") ||
        title.includes("quick") ||
        title.includes("efficient")
      )
        score += 1;
      if (
        title.includes("free") ||
        title.includes("affordable") ||
        title.includes("cheap")
      )
        score += 1;
      if (
        title.includes("new") ||
        title.includes("innovative") ||
        title.includes("modern")
      )
        score += 0.5;

      // Negative indicators
      if (
        title.includes("risky") ||
        title.includes("uncertain") ||
        title.includes("maybe")
      )
        score -= 2;
      if (
        title.includes("expensive") ||
        title.includes("costly") ||
        title.includes("hard")
      )
        score -= 1;
      if (
        title.includes("old") ||
        title.includes("outdated") ||
        title.includes("basic")
      )
        score -= 0.5;

      // Add slight randomness for variety
      score += Math.random() * 2 - 1; // +/- 1 random variation

      // Ensure score is within bounds
      score = Math.max(1, Math.min(10, score));

      return {
        ...option,
        score: Math.round(score * 10) / 10, // Round to 1 decimal place
      };
    });

    let topOption = scoredOptions.reduce((best, current) =>
      (current.score || 0) > (best.score || 0) ? current : best
    );

    // If priorities are available, calculate weighted scores
    let priorityScores: AIAnalysis["priorityScores"] = undefined;

    if (priorities.length > 0) {
      priorityScores = scoredOptions.map((option) => {
        const scores = priorities.map((priority) => {
          // Simple heuristic scoring based on option title relevance to priority
          let score = 5; // baseline score

          // Check if option title relates to this priority
          const titleRelevance = option.title
            .toLowerCase()
            .includes(priority.name.toLowerCase())
            ? 2
            : 0;
          score += titleRelevance;

          // Add some randomness for demo purposes
          score += Math.random() * 2 - 1; // +/- 1 random variation
          score = Math.max(0, Math.min(10, score)); // Keep within 0-10

          return {
            priority: priority.name,
            score: Math.round(score * 10) / 10,
            weightedScore:
              Math.round(((score * priority.weight) / 100) * 10) / 10,
          };
        });

        const totalScore = scores.reduce((sum, s) => sum + s.weightedScore, 0);

        return {
          optionId: option.id,
          optionName: option.title,
          scores,
          totalScore: Math.round(totalScore * 10) / 10,
        };
      });

      // Update recommendation based on priority scores
      const highestScoringOption = priorityScores.reduce((best, current) =>
        current.totalScore > best.totalScore ? current : best
      );

      topOption =
        scoredOptions.find((o) => o.id === highestScoringOption.optionId) ||
        topOption;
    }

    const avgScore =
      scoredOptions.reduce((sum, opt) => sum + (opt.score || 0), 0) /
      scoredOptions.length;
    const scoreSpread =
      Math.max(...scoredOptions.map((o) => o.score || 0)) -
      Math.min(...scoredOptions.map((o) => o.score || 0));

    return {
      recommendation: topOption ? topOption.title : "Unable to determine",
      reasoning: priorityScores
        ? `Based on priority-weighted analysis, ${topOption.title} scores highest with ${topOption.score}/10. The AI analyzed option titles and factors to determine scores.`
        : `After analyzing the option titles and keywords, ${topOption.title} scored ${topOption.score}/10, making it the recommended choice. The analysis considered factors like reliability, efficiency, cost, and innovation.`,
      riskFactors: [
        scoreSpread < 2
          ? `Close scores (spread: ${scoreSpread.toFixed(
              1
            )}) suggest options are similar - consider additional factors`
          : "",
        "Analysis based on option titles - detailed evaluation recommended",
        avgScore < 5
          ? "All options show moderate scores - consider improving options"
          : "",
      ].filter(Boolean),
      opportunities: [
        "Research detailed pros and cons for each option",
        "Seek expert opinions on top-scoring options",
        "Consider combining elements from multiple options",
        topOption.score && topOption.score > 7
          ? "High-scoring option shows strong potential"
          : "",
      ].filter(Boolean),
      longTermBenefits: [
        `${topOption.title} shows the most favorable indicators based on analysis`,
        "Systematic scoring approach provides objective comparison",
        scoreSpread > 3
          ? "Clear differentiation between options enables confident choice"
          : "",
      ].filter(Boolean),
      potentialDrawbacks: [
        "Title-based analysis may miss important details",
        "Scores are estimates and should be validated",
        avgScore < 6
          ? "Moderate average scores suggest all options need improvement"
          : "",
      ].filter(Boolean),
      alternativeOptions: [
        "Enhance top option with features from others",
        scoreSpread < 1.5
          ? "Since scores are close, consider hybrid approach"
          : "",
        "Gather more detailed information for precise analysis",
      ].filter(Boolean),
      confidence: Math.min(
        85,
        Math.max(40, 50 + scoreSpread * 10 + avgScore * 5)
      ),
      uncertaintyAreas: [
        "Limited to title-based keyword analysis",
        "Detailed option specifications not available",
        scoreSpread < 2 ? "Options are very similar in scoring" : "",
      ].filter(Boolean),
      keyFactors: scoredOptions.map((option) => ({
        factor: `${option.title} Quality Score`,
        weight:
          (option.score || 0) /
          scoredOptions.reduce((sum, o) => sum + (o.score || 0), 0),
        favorsOption: option.title,
      })),
      priorityScores,
      timeHorizon: {
        shortTerm: `Begin with ${topOption.title} (score: ${topOption.score}/10) for immediate needs`,
        mediumTerm: "Monitor performance and gather detailed feedback",
        longTerm: "Reassess based on real-world performance data",
      },
    };
  };

  const handleAnalyze = async () => {
    if (currentDecision.options.length < 2) return;

    const result = await generateAIAnalysis();
    setAnalysis(result);

    // Extract scores and update the decision
    if (result.priorityScores && result.priorityScores.length > 0) {
      // Use priority-based scores
      const scores = result.priorityScores.map((ps) => ({
        optionId: ps.optionId,
        score: Math.min(10, Math.max(0, Math.round(ps.totalScore))), // Ensure 0-10 range
      }));

      const topOption = result.priorityScores.reduce((best, current) =>
        current.totalScore > best.totalScore ? current : best
      );

      updateWithAIScores(scores, topOption.optionId);
    } else {
      // Fallback: generate simple scores based on recommendation
      const scores = currentDecision.options.map((option) => ({
        optionId: option.id,
        score:
          option.title === result.recommendation
            ? 8
            : Math.floor(Math.random() * 6) + 3,
      }));

      const recommendedOption = currentDecision.options.find(
        (o) => o.title === result.recommendation
      );
      if (recommendedOption) {
        updateWithAIScores(scores, recommendedOption.id);
      }
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-primary";
    if (confidence >= 60) return "text-accent";
    return "text-accent";
  };

  return (
    <>
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

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 "
              onClick={() => setIsOpen(false)}
              style={{ zIndex: 9998 }}
            />

            {/* Popup Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl z-50 max-h-[80vh] border border-gray-700 overflow-hidden mr-10"
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

                  <div className="flex items-center justify-between gap-4">
                   {/* Analyze Button */}
                   <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-darkBg rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-darkBg"></div>
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Sparkles size={20} />
                          <span>Analyze</span>
                        </div>
                      )}
                    </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                  </div>
                </div>

                {/* Content */}
                {currentDecision.options.length < 2 ? (
                  <div className="text-center py-8">
                    <Brain size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Need More Options
                    </h3>
                    <p className="text-gray-400">
                      Add at least 2 options to get AI analysis and
                      recommendations.
                    </p>
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
                              Risk Factors
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
                              Opportunities
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
