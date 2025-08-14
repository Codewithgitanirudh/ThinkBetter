import DecisionForm from '@/components/DecisionForm';
import { Sparkles, Brain, History } from 'lucide-react';
import Link from 'next/link';

export default function AppHome() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Make Better Decisions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                ThinkBetter helps you weigh options with structured pros/cons, AI-powered insights, and personalized history — so you can act with clarity and confidence.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link href="#make" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
                  Start now
                </Link>
                <Link href="/app/history" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  View history
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2"><Sparkles size={16} /> AI insights and recommendations</div>
                <div className="flex items-center gap-2"><Brain size={16} /> Structured decision framework</div>
                <div className="flex items-center gap-2"><History size={16} /> Private, user-specific history</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Maker */}
        <div id="make" className="">
          <DecisionForm />
        </div>
      </div>
    </div>
  );
}


