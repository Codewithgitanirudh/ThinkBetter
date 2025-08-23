'use client';

import { useDecision } from '@/context/DecisionContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function HistoryList() {
  const { decisions, loading, removeDecision, isopen, setIsopen } = useDecision();
  const [decisionId, setDecisionId] = useState<string>('');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (decisions.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No decisions saved yet</h3>
        <Link href="/app" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
          Make Your First Decision
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <div className="space-y-8">
        {decisions.map((decision, index) => {

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
                <div className="text-right flex gap-4">
                  <div className="flex flex-col gap-2">
                  <p className="text-sm">{decision.options.length} options</p>
                  </div>
                  <button className="p-3 text-white cursor-pointer bg-red-500 hover:bg-red-600 rounded-md transition-colors" onClick={() => {
                    setDecisionId(decision.id)
                    setIsopen(true)
                  }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {decision.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`p-3 rounded-md ${option.id === decision.selectedOptionId ? 'bg-slate-700 border-[2px] border-amber-700' : 'bg-slate-600'}`}
                  >
                    <p className="font-medium text-white">{option.title}</p>
                    <div className="flex justify-end text-sm mt-1">
                      {option.score !== undefined && (
                        <span className={`font-medium ${option.score > 7 ? 'text-green-400' : option.score > 5 ? 'text-blue-400' : option.score > 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                          AI Score: {option.score}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
        <DeleteDecisionModal isopen={isopen} setIsopen={setIsopen} removeDecision={removeDecision} decisionId={decisionId} />
      </div>
    </div>
    
  );
}

const DeleteDecisionModal = ({isopen, setIsopen, removeDecision, decisionId}: {isopen: boolean, setIsopen: (isopen: boolean) => void, removeDecision: (id: string) => void, decisionId: string}) => {
  console.log(decisionId, "sdf");
  
  return (
    <>
    {isopen && ( 
      <motion.div className="fixed inset-0 top-0 right-0 bg-black/20 backdrop-blur-xs w-full h-full flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white px-4 py-6 rounded-lg shadow-md flex flex-col max-w-md gap-3">
          <h2 className="text-xl text-red-500 font-bold">Delete Decision</h2>
          <p className="text-sm text-gray-500">Are you sure you want to delete this decision? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-3">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => {
              removeDecision(decisionId)
              setIsopen(false)
            }}>Delete</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsopen(false)}>Close</button>
          </div>
        </div>
      </motion.div>
    )}
    </>
  )
}