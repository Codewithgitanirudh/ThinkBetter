'use client';

import { useState } from 'react';
import { useDecision } from '@/context/DecisionContext';
import { Option } from '@/types';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg shadow-md ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}
    >
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex w-full">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 p-2 border rounded mr-2"
              autoFocus
            />
            <button
              onClick={handleUpdateTitle}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{option.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => removeOption(option.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <h4 className="font-medium text-green-600 mb-2">Pros (+{option.pros.length})</h4>
          <ul className="space-y-2">
            {option.pros.map((pro) => (
              <motion.li
                key={pro.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-between items-center bg-green-50 p-2 rounded"
              >
                <span>{pro.text}</span>
                <button
                  onClick={() => removePro(option.id, pro.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </motion.li>
            ))}
          </ul>
          <form onSubmit={handleAddPro} className="mt-2">
            <div className="flex">
              <input
                type="text"
                value={proText}
                onChange={(e) => setProText(e.target.value)}
                placeholder="Add a pro"
                className="flex-1 p-2 border rounded-l"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-green-500 text-white rounded-r hover:bg-green-600"
              >
                +
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/2 pl-2">
          <h4 className="font-medium text-red-600 mb-2">Cons (-{option.cons.length})</h4>
          <ul className="space-y-2">
            {option.cons.map((con) => (
              <motion.li
                key={con.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-between items-center bg-red-50 p-2 rounded"
              >
                <span>{con.text}</span>
                <button
                  onClick={() => removeCon(option.id, con.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </motion.li>
            ))}
          </ul>
          <form onSubmit={handleAddCon} className="mt-2">
            <div className="flex">
              <input
                type="text"
                value={conText}
                onChange={(e) => setConText(e.target.value)}
                placeholder="Add a con"
                className="flex-1 p-2 border rounded-l"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-red-500 text-white rounded-r hover:bg-red-600"
              >
                +
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center">
        <span className={`text-xl font-bold ${option.score > 0 ? 'text-green-600' : option.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          Score: {option.score}
        </span>
      </div>
    </motion.div>
  );
}