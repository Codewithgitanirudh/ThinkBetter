'use client';

import { useDecision } from '@/context/DecisionContext';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, AlertTriangle, Target } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AIInsightsPage() {
  const { decisions, currentDecision } = useDecision();

  const getInsightCards = () => {
    const totalDecisions = decisions.length;
    const avgOptionsPerDecision = totalDecisions > 0 
      ? decisions.reduce((sum, d) => sum + d.options.length, 0) / totalDecisions 
      : 0;
    
    const mostFrequentScore = decisions.length > 0 
      ? Math.max(...decisions.flatMap(d => d.options.map(o => o.score)))
      : 0;

    return [
      {
        title: 'Decision Patterns',
        value: `${totalDecisions} decisions made`,
        insight: `You average ${avgOptionsPerDecision.toFixed(1)} options per decision`,
        icon: TrendingUp,
        color: 'bg-blue-500',
      },
      {
        title: 'Best Performing Option',
        value: `Score: ${mostFrequentScore}`,
        insight: 'Your highest-scoring option to date',
        icon: Target,
        color: 'bg-green-500',
      },
      {
        title: 'AI Recommendation',
        value: 'Consider More Factors',
        insight: 'Include emotional and long-term impacts in your analysis',
        icon: Brain,
        color: 'bg-purple-500',
      },
      {
        title: 'Next Steps',
        value: 'Optimize Process',
        insight: 'Try adding more detailed pros and cons for better accuracy',
        icon: Lightbulb,
        color: 'bg-yellow-500',
      },
    ];
  };

  const insights = getInsightCards();

  return (
    <div className="relative min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            AI Insights
          </h1>
          <p className="text-xl">
            Discover patterns and get AI-powered recommendations for better decision-making
          </p>
        </div>

        {decisions.length === 0 ? (
          <div className="text-center py-12">
            <Brain size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              No Decisions Yet
            </h3>
            <p className="mb-6">
              Make some decisions first to see AI-powered insights and patterns
            </p>
            <Link 
              href="/app"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <Brain size={20} className="mr-2" />
              Start Your First Decision
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className={`${insight.color} p-3 rounded-lg w-fit mb-4`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {insight.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {insight.insight}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Current Decision Analysis */}
            {currentDecision.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Current Decision Analysis
                </h2>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {currentDecision.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Options</p>
                      <p className="text-xl font-bold text-purple-600">{currentDecision.options.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Pros</p>
                      <p className="text-xl font-bold text-green-600">
                        {currentDecision.options.reduce((sum, opt) => sum + opt.pros.length, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Cons</p>
                      <p className="text-xl font-bold text-red-600">
                        {currentDecision.options.reduce((sum, opt) => sum + opt.cons.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                AI Recommendations
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp size={20} className="text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-200">Improve Decision Quality</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Consider adding weight factors to pros and cons based on importance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle size={20} className="text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Bias Check</h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">
                      Review your decisions for confirmation bias - are you favoring familiar options?
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Lightbulb size={20} className="text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-200">Next Level</h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Try the "Help Me Decide" feature more often to reduce decision fatigue
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}