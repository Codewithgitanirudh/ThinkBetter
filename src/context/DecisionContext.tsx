'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { Decision, Option, Pro, Con } from '@/types';

interface DecisionContextType {
  currentDecision: Decision;
  decisions: Decision[];
  setTitle: (title: string) => void;
  addOption: (title: string) => void;
  updateOption: (id: string, title: string) => void;
  removeOption: (id: string) => void;
  addPro: (optionId: string, text: string) => void;
  removePro: (optionId: string, proId: string) => void;
  addCon: (optionId: string, text: string) => void;
  removeCon: (optionId: string, conId: string) => void;
  calculateScores: () => void;
  saveDecision: () => Promise<string>;
  helpMeDecide: () => void;
  resetForm: () => void;
  loading: boolean;
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
  const [loading, setLoading] = useState(false);

  // Fetch decisions from Firestore
  useEffect(() => {
    const fetchDecisions = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'decisions'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const decisionsData: Decision[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          decisionsData.push({
            id: doc.id,
            title: data.title,
            options: data.options,
            timestamp: data.timestamp.toDate(),
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
  }, []);

  // Set decision title
  const setTitle = (title: string) => {
    setCurrentDecision(prev => ({ ...prev, title }));
  };

  // Add a new option
  const addOption = (title: string) => {
    const newOption: Option = {
      id: Date.now().toString(),
      title,
      pros: [],
      cons: [],
      score: 0,
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

  // Add a pro to an option
  const addPro = (optionId: string, text: string) => {
    const newPro: Pro = {
      id: Date.now().toString(),
      text,
    };

    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId
          ? { ...option, pros: [...option.pros, newPro] }
          : option
      ),
    }));

    calculateScores();
  };

  // Remove a pro from an option
  const removePro = (optionId: string, proId: string) => {
    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId
          ? { ...option, pros: option.pros.filter(pro => pro.id !== proId) }
          : option
      ),
    }));

    calculateScores();
  };

  // Add a con to an option
  const addCon = (optionId: string, text: string) => {
    const newCon: Con = {
      id: Date.now().toString(),
      text,
    };

    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId
          ? { ...option, cons: [...option.cons, newCon] }
          : option
      ),
    }));

    calculateScores();
  };

  // Remove a con from an option
  const removeCon = (optionId: string, conId: string) => {
    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId
          ? { ...option, cons: option.cons.filter(con => con.id !== conId) }
          : option
      ),
    }));

    calculateScores();
  };

  // Calculate scores for all options
  const calculateScores = () => {
    setCurrentDecision(prev => ({
      ...prev,
      options: prev.options.map(option => ({
        ...option,
        score: option.pros.length - option.cons.length,
      })),
    }));
  };

  // Help me decide function
  const helpMeDecide = () => {
    if (currentDecision.options.length === 0) return;

    // Find the highest score
    const highestScore = Math.max(...currentDecision.options.map(option => option.score));
    
    // Find all options with the highest score
    const topOptions = currentDecision.options.filter(option => option.score === highestScore);
    
    // If there's a tie, randomly select one
    const selectedOption = topOptions[Math.floor(Math.random() * topOptions.length)];
    
    setCurrentDecision(prev => ({
      ...prev,
      selectedOptionId: selectedOption.id,
    }));
  };

  // Save decision to Firestore
  const saveDecision = async () => {
    if (!currentDecision.title || currentDecision.options.length === 0) {
      throw new Error('Decision must have a title and at least one option');
    }

    setLoading(true);
    try {
      // Prepare the decision data for Firestore
      const decisionData = {
        title: currentDecision.title,
        options: currentDecision.options,
        timestamp: serverTimestamp(),
        selectedOptionId: currentDecision.selectedOptionId,
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, 'decisions'), decisionData);
      
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
        addPro,
        removePro,
        addCon,
        removeCon,
        calculateScores,
        saveDecision,
        helpMeDecide,
        resetForm,
        loading,
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