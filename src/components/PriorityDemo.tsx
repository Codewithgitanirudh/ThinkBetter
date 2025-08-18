'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Decision, Priority, Option } from '@/types';
import { createTestDecision, getExpectedAnalysis } from '@/lib/ai/testAnalysis';
import { Calculator, TrendingUp, Award } from 'lucide-react';

export default function PriorityDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const testDecision = createTestDecision();
  const expectedAnalysis = getExpectedAnalysis();

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
            Priority-Based AI Analysis Demo
          </h3>
          <p className="text-text mb-4">
            See how AI analyzes decisions using weighted priorities
          </p>
          <button
            onClick={() => setShowDemo(true)}
            className="px-6 py-3 bg-primary text-darkBg rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Demo Analysis
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
      {/* Demo Header */}
      <div className="bg-darkSurface p-6 rounded-xl border border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">
              {testDecision.title}
            </h2>
            <p className="text-text">
              AI Analysis Example: Work From Office vs Work From Home
            </p>
          </div>
          <button
            onClick={() => setShowDemo(false)}
            className="px-4 py-2 bg-darkBg text-text rounded-lg hover:bg-darkBg/80 transition-colors"
          >
            Close Demo
          </button>
        </div>
      </div>

      {/* Priorities */}
      <div className="bg-darkSurface p-6 rounded-xl border border-accent">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={20} className="text-accent" />
          <h3 className="text-xl font-bold text-accent">User Priorities</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testDecision.priorities?.map((priority) => (
            <div key={priority.id} className="text-center p-3 bg-darkBg rounded-lg">
              <div className="text-accent font-bold text-2xl mb-1">
                {priority.weight}%
              </div>
              <div className="text-text font-medium">{priority.name}</div>
              <div className="text-text text-xs mt-1">{priority.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testDecision.options.map((option) => (
          <div key={option.id} className="bg-darkSurface p-6 rounded-xl border border-darkSurface">
            <h4 className="text-lg font-bold text-text mb-3">{option.title}</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-primary font-medium mb-2">Pros ({option.pros.length})</h5>
                <ul className="space-y-1">
                  {option.pros.map((pro) => (
                    <li key={pro.id} className="text-sm text-text flex items-start space-x-2">
                      <span className="text-primary mt-1">+</span>
                      <span>{pro.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-accent font-medium mb-2">Cons ({option.cons.length})</h5>
                <ul className="space-y-1">
                  {option.cons.map((con) => (
                    <li key={con.id} className="text-sm text-text flex items-start space-x-2">
                      <span className="text-accent mt-1">-</span>
                      <span>{con.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis Results */}
      <div className="bg-darkSurface p-6 rounded-xl border border-primary">
        <div className="flex items-center space-x-2 mb-4">
          <Award size={20} className="text-primary" />
          <h3 className="text-xl font-bold text-primary">AI Analysis Results</h3>
        </div>

        {/* Recommendation */}
        <div className="bg-darkBg p-4 rounded-lg mb-4 border border-primary">
          <h4 className="font-semibold text-primary mb-2">📋 Recommendation</h4>
          <p className="text-primary font-medium mb-2">{expectedAnalysis.recommendation}</p>
          <p className="text-text text-sm">{expectedAnalysis.reasoning}</p>
          <div className="mt-2">
            <span className="text-text text-sm">Confidence: </span>
            <span className="text-primary font-bold">{expectedAnalysis.confidence}%</span>
          </div>
        </div>

        {/* Priority Scoring */}
        <div className="bg-darkBg p-4 rounded-lg border border-primary">
          <h4 className="font-semibold text-primary mb-4">🧮 Priority-Based Scoring</h4>
          <div className="space-y-4">
            {expectedAnalysis.priorityScores?.map((optionScore, index) => (
              <div key={index} className="border border-darkSurface rounded-lg p-3">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-text">{optionScore.optionName}</h5>
                  <span className="bg-primary text-darkBg px-3 py-1 rounded font-bold text-lg">
                    {optionScore.totalScore}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {optionScore.scores.map((score, scoreIndex) => (
                    <div key={scoreIndex} className="flex justify-between items-center bg-darkSurface p-2 rounded">
                      <span className="text-text font-medium">{score.priority}:</span>
                      <span className="text-primary font-mono">
                        {score.score}/10 × {testDecision.priorities?.find(p => p.name === score.priority)?.weight}% = {score.weightedScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="bg-darkBg p-4 rounded-lg mt-4 border border-accent">
          <h4 className="font-semibold text-accent mb-2">🧮 How It Works</h4>
          <div className="text-sm text-text space-y-2">
            <p><strong>Step 1:</strong> AI scores each option against each priority (0-10 scale)</p>
            <p><strong>Step 2:</strong> Multiply score by priority weight (score × weight ÷ 100)</p>
            <p><strong>Step 3:</strong> Sum all weighted scores for each option</p>
            <p><strong>Step 4:</strong> Recommend option with highest total score</p>
            <p><strong>Step 5:</strong> Confidence based on score difference (closer = lower confidence)</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
