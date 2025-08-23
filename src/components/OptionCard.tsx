'use client';

import { useState } from 'react';
import { useDecision } from '@/context/DecisionContext';
import { Option } from '@/types';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Crown, Sparkles } from 'lucide-react';

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
}

export default function OptionCard({ option, isSelected }: OptionCardProps) {
  const { updateOption, removeOption } = useDecision();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(option.title);

  const handleUpdateTitle = () => {
    if (editTitle.trim()) {
      updateOption(option.id, editTitle);
      setIsEditing(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    if (score > 7) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score > 5) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (score > 3) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' 
          : 'bg-white dark:bg-gray-800 hover:shadow-xl'
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-full shadow-lg"
        >
          <Crown size={16} />
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex w-full space-x-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <button
              onClick={handleUpdateTitle}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{option.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => removeOption(option.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* AI Score Display */}
      {option.score !== undefined && (
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(option.score)}`}>
            <Sparkles size={16} className="mr-2" />
            AI Score: {option.score}/10
          </div>
        </div>
      )}

      {/* Placeholder for AI analysis */}
      {!option.score && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Use AI Assistant to analyze this option</p>
        </div>
      )}
    </motion.div>
  );
}