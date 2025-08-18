'use client';

import { useDecision } from '@/context/DecisionContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HistoryList() {
  const { decisions, loading } = useDecision();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">Sign in to view your decision history</h3>
        <button
          onClick={signInWithGoogle}
          className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (decisions.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No decisions saved yet</h3>
        <Link href="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
          Make Your First Decision
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <div className="space-y-8">
        {decisions.map((decision, index) => {
          const selectedOption = decision.options.find(
            option => option.id === decision.selectedOptionId
          );

          return (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{decision.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(decision.timestamp).toLocaleDateString()} at {new Date(decision.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{decision.options.length} options</p>
                  {selectedOption && (
                    <p className="font-medium text-cyan-400">
                      Choice: {selectedOption.title} (Score: {selectedOption.score})
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {decision.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`p-3 rounded-md ${option.id === decision.selectedOptionId ? 'bg-slate-700 border-[2px] border-amber-700' : 'bg-slate-600'}`}
                  >
                    <p className="font-medium text-white">{option.title}</p>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-green-400">+{option.pros.length}</span>
                      <span className="text-red-400">-{option.cons.length}</span>
                      <span className={`font-medium ${option.score > 0 ? 'text-green-400' : option.score < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        Score: {option.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}