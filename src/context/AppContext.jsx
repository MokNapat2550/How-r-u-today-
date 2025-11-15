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

  const providerValue = {
    moods: appState.moods,
    plans: appState.plans,
    notes: appState.notes,
    addMood,
    addPlan,
    addNote
  };

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext, AppProvider, useAppContext };