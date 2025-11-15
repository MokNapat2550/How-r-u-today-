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

  // --- 💎 นี่คือฟังก์ชันที่เพิ่มเข้ามา (1/2) ---
  const deletePlan = (dateString, planIndex) => {
    setAppState(prev => {
      const existingPlans = prev.plans[dateString] || [];
      // กรอง Plan รายการที่ถูกเลือกออก
      const updatedPlans = existingPlans.filter((_, index) => index !== planIndex);
      
      const newPlansState = { ...prev.plans }; // คัดลอก state 'plans' ทั้งหมด
      
      if (updatedPlans.length > 0) {
        newPlansState[dateString] = updatedPlans; // อัปเดต plan ของวันนั้น
      } else {
        delete newPlansState[dateString]; // ถ้าไม่เหลือ plan เลย ให้ลบ key ของวันนั้นทิ้ง
      }
      
      return { ...prev, plans: newPlansState }; // คืนค่า state ใหม่
    });
  };

  // --- 💎 นี่คือฟังก์ชันที่เพิ่มเข้ามา (2/2) ---
  const deleteNote = (dateString) => {
    setAppState(prev => {
      const newNotesState = { ...prev.notes }; // คัดลอก state 'notes' ทั้งหมด
      delete newNotesState[dateString]; // ลบ key ของวันนั้น
      
      return { ...prev, notes: newNotesState }; // คืนค่า state ใหม่
    });
  };


  // --- 💎 อัปเดต providerValue ---
  const providerValue = {
    moods: appState.moods,
    plans: appState.plans,
    notes: appState.notes,
    addMood,
    addPlan,
    addNote,
    // --- เพิ่มฟังก์ชันใหม่เข้าไป ---
    deletePlan,
    deleteNote
  };

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext, AppProvider, useAppContext };