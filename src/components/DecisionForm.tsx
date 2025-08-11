'use client';

import { useState } from 'react';
import { useDecision } from '@/context/DecisionContext';
import OptionCard from './OptionCard';
import { motion, AnimatePresence } from 'framer-motion';
import ResultDisplay from './ResultDisplay';
import { Plus, Sparkles, Save, RotateCcw } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <div className="mb-6">
          <label htmlFor="decision-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What are you deciding?
          </label>
          <input
            id="decision-title"
            type="text"
            value={currentDecision.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Which job offer should I accept?"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white text-lg"
          />
        </div>

        <form onSubmit={handleAddOption} className="space-y-4">
          <label htmlFor="option-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Add your options ({currentDecision.options.length}/5)
          </label>
          <div className="flex space-x-3">
            <input
              id="option-title"
              type="text"
              value={optionTitle}
              onChange={(e) => setOptionTitle(e.target.value)}
              placeholder="Enter an option..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              disabled={currentDecision.options.length >= 5}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              disabled={!optionTitle.trim() || currentDecision.options.length >= 5}
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
          {currentDecision.options.length >= 5 && (
            <p className="text-sm text-amber-600 dark:text-amber-400">Maximum 5 options allowed</p>
          )}
        </form>
      </motion.div>

      {/* Options Grid */}
      {currentDecision.options.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Options</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Decision Actions */}
      {currentDecision.options.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Help Me Decide Button */}
          <div className="text-center">
            <button
              onClick={helpMeDecide}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 text-lg flex items-center space-x-3 mx-auto"
            >
              <Sparkles size={24} />
              <span>Help Me Decide</span>
            </button>
          </div>

          {/* Result Display */}
          {currentDecision.selectedOptionId && (
            <ResultDisplay />
          )}

          {/* Save/Reset Actions */}
          {currentDecision.title && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSaveDecision}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{loading ? 'Saving...' : 'Save Decision'}</span>
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 flex items-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg text-center"
          >
            {saveMessage}
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-center"
          >
            {saveError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}