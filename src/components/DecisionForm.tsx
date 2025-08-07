'use client';

import { useState } from 'react';
import { useDecision } from '@/context/DecisionContext';
import OptionCard from './OptionCard';
import { motion, AnimatePresence } from 'framer-motion';
import ResultDisplay from './ResultDisplay';

export default function DecisionForm() {
  const { 
    currentDecision, 
    setTitle, 
    addOption, 
    helpMeDecide, 
    saveDecision, 
    resetForm,
    loading 
  } = useDecision();
  
  const [optionTitle, setOptionTitle] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (optionTitle.trim() && currentDecision.options.length < 5) {
      addOption(optionTitle);
      setOptionTitle('');
    }
  };

  const handleSaveDecision = async () => {
    try {
      await saveDecision();
      setSaveMessage('Decision saved successfully!');
      setSaveError('');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveError('Error saving decision. Please try again.');
      setSaveMessage('');
      setTimeout(() => setSaveError(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Decision Helper</h1>
        
        <div className="mb-6">
          <label htmlFor="decision-title" className="block text-sm font-medium text-gray-700 mb-1">
            Decision Title
          </label>
          <input
            id="decision-title"
            type="text"
            value={currentDecision.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you deciding?"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <form onSubmit={handleAddOption} className="mb-6">
          <label htmlFor="option-title" className="block text-sm font-medium text-gray-700 mb-1">
            Add Option (2-5)
          </label>
          <div className="flex">
            <input
              id="option-title"
              type="text"
              value={optionTitle}
              onChange={(e) => setOptionTitle(e.target.value)}
              placeholder="Enter an option"
              className="flex-1 p-3 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={currentDecision.options.length >= 5}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              disabled={!optionTitle.trim() || currentDecision.options.length >= 5}
            >
              Add
            </button>
          </div>
          {currentDecision.options.length >= 5 && (
            <p className="mt-1 text-sm text-amber-600">Maximum 5 options allowed</p>
          )}
        </form>
      </motion.div>

      {currentDecision.options.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Your Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {currentDecision.options.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={option.id === currentDecision.selectedOptionId}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {currentDecision.options.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <button
            onClick={helpMeDecide}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mb-4"
          >
            Help Me Decide
          </button>

          {currentDecision.selectedOptionId && (
            <ResultDisplay />
          )}
        </motion.div>
      )}

      {currentDecision.options.length >= 2 && currentDecision.title && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center space-x-4"
        >
          <button
            onClick={handleSaveDecision}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Decision'}
          </button>
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </motion.div>
      )}

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center"
        >
          {saveMessage}
        </motion.div>
      )}

      {saveError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center"
        >
          {saveError}
        </motion.div>
      )}
    </div>
  );
}