'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Decision, Option, AIAnalysis } from '@/types';

interface DecisionContextType {
  currentDecision: Decision;
  decisions: Decision[];
  setTitle: (title: string) => void;
  addOption: (title: string) => void;
  updateOption: (id: string, title: string) => void;
  removeOption: (id: string) => void;
  updateWithAIScores: (scores: Array<{ optionId: string; score: number }>, selectedOptionId: string) => void;
  saveDecision: () => Promise<string>;
  resetForm: () => void;
  loading: boolean;
  removeDecision: (id: string) => Promise<void>;
  isopen: boolean;
  setIsopen: (isopen: boolean) => void;
  analysis: AIAnalysis | null;
  setAnalysis: (analysis: AIAnalysis | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isMobile: boolean) => void;
}

const initialDecision: Decision = {
  id: '',
  title: '',
  options: [],
  timestamp: new Date(),
};

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [currentDecision, setCurrentDecision] = useState<Decision>(initialDecision);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isopen, setIsopen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  // Fetch decisions from Firestore for the authenticated user
  useEffect(() => {
    const fetchDecisions = async () => {
      if (!user) {
        setDecisions([]);
        return;
      }
      setLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'decisions'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const decisionsData: Decision[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          decisionsData.push({
            id: docSnap.id,
            title: data.title,
            options: data.options,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
            selectedOptionId: data.selectedOptionId,
          });
        });

        setDecisions(decisionsData);
      } catch (error) {
        console.error('Error fetching decisions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, [user]);

  // Set decision title
  const setTitle = (title: string) => {
    setCurrentDecision(prev => ({ ...prev, title }));
  };

  // Add a new option
  const addOption = (title: string) => {
    const newOption: Option = {
      id: Date.now().toString(),
      title,
    };

    setCurrentDecision(prev => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  // Update an option
  const updateOption = (id: string, title: string) => {
    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === id ? { ...option, title } : option
      ),
    }));
  };

  // Remove an option
  const removeOption = (id: string) => {
    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== id),
    }));
  };

  // Update options with AI scores and set selected option
  const updateWithAIScores = (scores: Array<{ optionId: string; score: number }>, selectedOptionId: string) => {
    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option => {
        const scoreData = scores.find(s => s.optionId === option.id);
        return scoreData ? { ...option, score: scoreData.score } : option;
      }),
      selectedOptionId,
    }));
  };

  // Save decision to Firestore (requires auth)
  const saveDecision = async () => {
    if (!currentDecision.title || currentDecision.options.length === 0) {
      throw new Error('Decision must have a title and at least one option');
    }
    if (!user) {
      throw new Error('Please sign in to save your decision');
    }

    setLoading(true);
    try {
      // Prepare the decision data for Firestore
      const decisionData = {
        title: currentDecision.title,
        options: currentDecision.options,
        timestamp: serverTimestamp(),
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, 'users', user.uid, 'decisions'), decisionData);
      
      // Update the local state with the new decision
      const newDecision = {
        ...currentDecision,
        id: docRef.id,
        timestamp: new Date(),
      };
      
      setDecisions(prev => [newDecision, ...prev]);
      return docRef.id;
    } catch (error) {
      console.error('Error saving decision:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeDecision = async (id : string) => {
    try {
      await deleteDoc(doc(db, "users", user?.uid || "", "decisions", id))
      setDecisions(prev => prev.filter(decision => decision.id !== id))
      setIsopen(false)
    } catch (error) {
      console.error('Error deleting decision:', error);
      throw error;
    }
  }

  // Reset the form
  const resetForm = () => {
    setCurrentDecision(initialDecision);
  };

  return (
    <DecisionContext.Provider
      value={{
        currentDecision,
        decisions,
        setTitle,
        addOption,
        updateOption,
        removeOption,
        updateWithAIScores,
        saveDecision,
        resetForm,
        loading,
        removeDecision,
        isopen,
        setIsopen,
        analysis,
        setAnalysis,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecision() {
  const context = useContext(DecisionContext);
  if (context === undefined) {
    throw new Error('useDecision must be used within a DecisionProvider');
  }
  return context;
}