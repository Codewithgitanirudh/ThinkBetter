"use client"

import { AIAnalysis, Decision } from "@/types";

  // Real AI analysis function using API

  const generateAIAnalysis = async (currentDecision: Decision, setIsAnalyzing: (isAnalyzing: boolean) => void): Promise<AIAnalysis> => {
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
      return getFallbackAnalysis(currentDecision);
    }
  };

  const getFallbackAnalysis = (currentDecision: Decision): AIAnalysis => {
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

export const handleAnalyze = async (currentDecision: Decision, updateWithAIScores: (scores: Array<{ optionId: string; score: number }>, selectedOptionId: string) => void, setIsAnalyzing: (isAnalyzing: boolean) => void, setAnalysis: (analysis: AIAnalysis) => void) => {

    if (currentDecision.options.length < 2) return;

    const result = await generateAIAnalysis(currentDecision, setIsAnalyzing);
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