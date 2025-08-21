import DecisionForm from '@/components/DecisionForm';
import AIAssistant from '@/components/AIAssistant';
import PriorityDemo from '@/components/PriorityDemo';
import { Sparkles, Brain, History } from 'lucide-react';
import Link from 'next/link';

export default function AppHome() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero */}
        <div className="bg-primary-light border border-primary-light rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-text">
                Make Better Decisions
              </h1>
              <p className="text-lg text-text max-w-2xl">
                ThinkBetter helps you weigh options with structured pros/cons, AI-powered insights, and personalized history — so you can act with clarity and confidence.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link href="#make" scroll={false} replace className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out hover:text-primary-dark">
                  Start now
                </Link>
                <Link href="/app/history" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 ease-in-out">
                  View history
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-text">
                <div className="flex items-center gap-2"><Sparkles size={16} className="text-primary" /> AI insights and recommendations</div>
                <div className="flex items-center gap-2"><Brain size={16} className="text-accent" /> Structured decision framework</div>
                <div className="flex items-center gap-2"><History size={16} className="text-primary" /> Private, user-specific history</div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Analysis Demo */}
        <PriorityDemo />

        {/* Decision Maker */}
          <DecisionForm />
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}


