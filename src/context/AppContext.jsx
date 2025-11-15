import React, { useState, createContext, useContext, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'how-r-u-today-app-state';

const getInitialState = () => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedState) {
      return JSON.parse(storedState);
    }
  } catch (error) {
    console.error("Failed to parse state from localStorage", error);
    localStorage.removeItem(LOCAL_STORAGE_KEY); 
  }
  
  return {
    moods: {},
    plans: {},
    notes: {},
  };
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState(getInitialState);
  
  // --- 💎 1. แก้ไข State เริ่มต้นสำหรับเพลง ---
  // เปลี่ยนจาก false เป็น true
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); 

  useEffect(() => {
    try {
      const stateString = JSON.stringify(appState);
      localStorage.setItem(LOCAL_STORAGE_KEY, stateString);
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [appState]); 

  const addMood = (dateString, mood) => {
    setAppState(prev => ({
      ...prev,
      moods: { ...prev.moods, [dateString]: mood }
    }));
  };

  const addPlan = (dateString, plan) => {
    setAppState(prev => {
      const existingPlans = prev.plans[dateString] || [];
      return {
        ...prev,
        plans: {
          ...prev.plans,
          [dateString]: [...existingPlans, plan]
        }
      };
    });
  };

  const addNote = (dateString, note) => {
    setAppState(prev => ({
      ...prev,
      notes: { ...prev.notes, [dateString]: note }
    }));
  };

  const deletePlan = (dateString, planIndex) => {
    setAppState(prev => {
      const existingPlans = prev.plans[dateString] || [];
      const updatedPlans = existingPlans.filter((_, index) => index !== planIndex);
      
      const newPlansState = { ...prev.plans }; 
      
      if (updatedPlans.length > 0) {
        newPlansState[dateString] = updatedPlans; 
      } else {
        delete newPlansState[dateString]; 
      }
      
      return { ...prev, plans: newPlansState }; 
    });
  };

  const deleteNote = (dateString) => {
    setAppState(prev => {
      const newNotesState = { ...prev.notes }; 
      delete newNotesState[dateString]; 
      
      return { ...prev, notes: newNotesState }; 
    });
  };

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  const providerValue = {
    moods: appState.moods,
    plans: appState.plans,
    notes: appState.notes,
    addMood,
    addPlan,
    addNote,
    deletePlan,
    deleteNote,
    isMusicPlaying,
    toggleMusic
  };

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext, AppProvider, useAppContext };