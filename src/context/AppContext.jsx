import React, { useState, createContext, useContext, useEffect, useRef } from 'react';

// --- 1. App Context (State Management) with LocalStorage ---

const LOCAL_STORAGE_KEY = 'how-r-u-today-app-state';

// 💎 1. กำหนดไฟล์เพลงของคุณที่นี่
// (ไฟล์นี้ต้องอยู่ในโฟลเดอร์ public/music/ ครับ)
const musicFileUrl = "/music/relaxing-music.mp3"; 

const getInitialState = () => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      // 💎 2. เพิ่ม chatbotQueue กลับเข้ามา
      return {
        moods: parsedState.moods || {},
        plans: parsedState.plans || {},
        notes: parsedState.notes || {},
        chatbotQueue: parsedState.chatbotQueue || [], 
      };
    }
  } catch (error) {
    console.error("Failed to parse state from localStorage", error);
    localStorage.removeItem(LOCAL_STORAGE_KEY); 
  }
  
  // 💎 3. เพิ่ม chatbotQueue ในค่าเริ่มต้น
  return {
    chatbotQueue: []
  };
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState(getInitialState);
  
  // (โค้ด State เพลงของคุณ)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); 
  
  // 💎 4. เพิ่ม audioRef (เครื่องเล่นเพลง) กลับเข้ามา
  const audioRef = useRef(null);

  // 💎 5. สร้าง <audio> element กลับเข้ามา
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFileUrl);
      audioRef.current.loop = true; // ให้เล่นวนซ้ำ
    }
  }, []); // [] = ทำงานแค่ครั้งแรกที่เปิดแอป

  // (โค้ดบันทึก localStorage ของคุณ)
  useEffect(() => {
    try {
      const stateString = JSON.stringify(appState);
      localStorage.setItem(LOCAL_STORAGE_KEY, stateString);
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [appState]); 

  // (โค้ด Add/Delete ของคุณ)
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

  // 💎 6. เพิ่มฟังก์ชัน Chatbot Queue กลับเข้ามา
  const queueChatbotMessage = (text) => {
    const newMessage = { from: 'bot', text: text, id: Date.now() };
    setAppState(prev => ({
      ...prev,
      chatbotQueue: [...prev.chatbotQueue, newMessage]
    }));
  };

  const consumeChatbotQueue = () => {
    const messages = appState.chatbotQueue;
    if (messages.length > 0) {
      setAppState(prev => ({ ...prev, chatbotQueue: [] }));
      return messages;
    }
    return [];
  };

  // 💎 7. อัปเกรด toggleMusic ให้ "เล่นเพลงได้จริง"
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.warn("Audio play failed, user interaction needed.", error);
        });
      }
      setIsMusicPlaying(!isMusicPlaying); // (ใช้ State ของคุณ)
    }
  };

  // 💎 8. เพิ่มฟังก์ชันใหม่ลงใน Provider Value
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
    toggleMusic,
    queueChatbotMessage,   // (เพิ่ม)
    consumeChatbotQueue, // (เพิ่ม)
  };

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext, AppProvider, useAppContext };