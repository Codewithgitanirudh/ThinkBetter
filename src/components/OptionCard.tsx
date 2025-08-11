'use client';

import { useState } from 'react';
import { useDecision } from '@/context/DecisionContext';
import { Option } from '@/types';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, X, Crown } from 'lucide-react';

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
}

export default function OptionCard({ option, isSelected }: OptionCardProps) {
  const { updateOption, removeOption, addPro, removePro, addCon, removeCon } = useDecision();
  const [proText, setProText] = useState('');
  const [conText, setConText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(option.title);

  const handleAddPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (proText.trim()) {
      addPro(option.id, proText);
      setProText('');
    }
  };

  const handleAddCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (conText.trim()) {
      addCon(option.id, conText);
      setConText('');
    }
  };

  const handleUpdateTitle = () => {
    if (editTitle.trim()) {
      updateOption(option.id, editTitle);
      setIsEditing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score < 0) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
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

      {/* Score Display */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(option.score)}`}>
          Score: {option.score}
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="space-y-6">
        {/* Pros Section */}
        <div>
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
            <span className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full text-sm mr-2">
              +{option.pros.length}
            </span>
            Pros
          </h4>
          <div className="space-y-2 mb-3">
            {option.pros.map((pro) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
              >
                <span className="text-green-800 dark:text-green-200">{pro.text}</span>
                <button
                  onClick={() => removePro(option.id, pro.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
          <form onSubmit={handleAddPro} className="flex space-x-2">
            <input
              type="text"
              value={proText}
              onChange={(e) => setProText(e.target.value)}
              placeholder="Add a positive aspect..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              <Plus size={16} />
            </button>
          </form>
        </div>

        {/* Cons Section */}
        <div>
          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center">
            <span className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full text-sm mr-2">
              -{option.cons.length}
            </span>
            Cons
          </h4>
          <div className="space-y-2 mb-3">
            {option.cons.map((con) => (
              <motion.div
                key={con.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
              >
                <span className="text-red-800 dark:text-red-200">{con.text}</span>
                <button
                  onClick={() => removeCon(option.id, con.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
          <form onSubmit={handleAddCon} className="flex space-x-2">
            <input
              type="text"
              value={conText}
              onChange={(e) => setConText(e.target.value)}
              placeholder="Add a negative aspect..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}