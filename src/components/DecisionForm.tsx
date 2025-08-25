"use client";

import { useState } from "react";
import { useDecision } from "@/context/DecisionContext";
import OptionCard from "./OptionCard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Save, RotateCcw } from "lucide-react";
import { handleAnalyze } from "./AiHandler";

export default function DecisionForm() {
  const {
    currentDecision,
    setTitle,
    addOption,
    saveDecision,
    resetForm,
    loading,
    updateWithAIScores,
    setIsopen,
    setAnalysis,
  } = useDecision();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optionTitle, setOptionTitle] = useState("");

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (optionTitle.trim() && currentDecision.options.length < 5) {
      addOption(optionTitle);
      setOptionTitle("");
    }
  };

  return (
    <div className="space-y-8 mt-10" id="make">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <div className="mb-6">
          <label
            htmlFor="decision-title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            What are you deciding?
          </label>
          <input
            id="decision-title"
            type="text"
            value={currentDecision.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Which job offer should I accept?"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white text-lg"
          />
        </div>

        <form onSubmit={handleAddOption} className="space-y-4">
          <label
            htmlFor="option-title"
            className="block text-sm font-medium text-gray-300"
          >
            Add your options ({currentDecision.options.length}/5)
          </label>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <input
              id="option-title"
              type="text"
              value={optionTitle}
              onChange={(e) => setOptionTitle(e.target.value)}
              placeholder="Enter an option..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
              disabled={currentDecision.options.length >= 5}
            />
            <button
              type="submit"
              className="px-6 py-3 w-full md:w-auto justify-center md:justify-start bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              disabled={
                !optionTitle.trim() || currentDecision.options.length >= 5
              }
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
          {currentDecision.options.length >= 5 && (
            <p className="text-sm text-amber-400">
              Maximum 5 options allowed
            </p>
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
          <h2 className="text-2xl font-bold text-white">
            Your Options
          </h2>
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
          {/* AI Prompt */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-200">
            <Sparkles size={32} className="mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              Ready for AI Analysis?
            </h3>
            <div className="flex items-center justify-between gap-4">
              {/* Analyze Button */}
              <button
                onClick={() => {
                  handleAnalyze(
                    currentDecision,
                    updateWithAIScores,
                    setIsAnalyzing,
                    setAnalysis
                  );
                  setIsopen(true);
                }}
                disabled={isAnalyzing}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-darkBg rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-darkBg"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles size={20} />
                    <span>Analyze</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Save/Reset Actions */}
          {currentDecision.title && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => saveDecision()}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{loading ? "Saving..." : "Save Decision"}</span>
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
    </div>
  );
}
