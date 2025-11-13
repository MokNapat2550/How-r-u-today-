import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [moods, setMoods] = useState({}); // e.g., { '2025-11-12': 'Happy' }
  const [plans, setPlans] = useState({}); // e.g., { '2025-11-12': ['Meet doctor', 'Buy groceries'] }
  const [notes, setNotes] = useState({}); // e.g., { '2025-11-12': 'Feeling tired today...' }

  const addMood = (dateString, mood) => {
    setMoods(prev => ({ ...prev, [dateString]: mood }));
  };

  const addPlan = (dateString, plan) => {
    setPlans(prev => {
      const existingPlans = prev[dateString] || [];
      return { ...prev, [dateString]: [...existingPlans, plan] };
    });
  };

  const addNote = (dateString, note) => {
    setNotes(prev => ({ ...prev, [dateString]: note }));
  };

  return (
    <AppContext.Provider value={{ moods, plans, notes, addMood, addPlan, addNote }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to easily access context
const useAppContext = () => useContext(AppContext);

export { AppContext, AppProvider, useAppContext };