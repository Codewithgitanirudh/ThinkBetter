'use client';

import { useDecision } from '@/context/DecisionContext';
import { motion } from 'framer-motion';

export default function ResultDisplay() {
  const { currentDecision } = useDecision();
  
  const selectedOption = currentDecision.options.find(
    option => option.id === currentDecision.selectedOptionId
  );

  if (!selectedOption) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-blue-500"
    >
      <h3 className="text-xl font-bold text-center mb-4">Decision Result</h3>
      <div className="text-center">
        <p className="text-lg mb-2">Your best option is:</p>
        <p className="text-2xl font-bold text-blue-600 mb-4">{selectedOption.title}</p>
        <div className="flex justify-center items-center">
          <span className="text-lg font-semibold">Score: </span>
          <span className={`ml-2 text-xl font-bold ${selectedOption.score > 0 ? 'text-green-600' : selectedOption.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {selectedOption.score}
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>{selectedOption.pros.length} pros, {selectedOption.cons.length} cons</p>
        </div>
      </div>
    </motion.div>
  );
}