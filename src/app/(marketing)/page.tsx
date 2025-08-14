'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles, Brain, TrendingUp, Check, BarChart, Users, Zap } from 'lucide-react';

export default function MarketingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/app');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Make Better Decisions with AI
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ThinkBetter helps you weigh options, analyze pros/cons, and get AI-powered insights to make confident choices.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-medium"
            >
              Get Started Free
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-blue-600" />,
              title: "AI-Powered Insights",
              description: "Get smart recommendations based on your decision criteria"
            },
            {
              icon: <Brain className="w-8 h-8 text-purple-600" />,
              title: "Structured Framework",
              description: "Break down complex decisions into manageable parts"
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-green-600" />,
              title: "Track Your Choices",
              description: "Review past decisions and learn from outcomes"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How ThinkBetter Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: <Check className="w-6 h-6 text-green-500" />,
                  title: "Define Your Decision",
                  description: "Clearly state what you're trying to decide"
                },
                {
                  icon: <BarChart className="w-6 h-6 text-blue-500" />,
                  title: "List Your Options",
                  description: "Add all possible choices you're considering"
                },
                {
                  icon: <Users className="w-6 h-6 text-purple-500" />,
                  title: "Weigh Pros & Cons",
                  description: "Add advantages and disadvantages for each option"
                },
                {
                  icon: <Zap className="w-6 h-6 text-yellow-500" />,
                  title: "Get AI Recommendations",
                  description: "Receive data-driven suggestions based on your inputs"
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <Sparkles className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Decision Making Process</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Visualize how ThinkBetter guides you through complex choices
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Make Better Decisions?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Join thousands of users who make confident choices with ThinkBetter
        </p>
        <Link 
          href="/signup" 
          className="inline-flex px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-medium"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
