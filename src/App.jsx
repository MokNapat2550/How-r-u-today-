import React, { useState, useEffect, useRef } from 'react'; // 💎 1. import useEffect, useRef
import { AppProvider, useAppContext } from './context/AppContext'; // 💎 2. import useAppContext
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ChatbotPage from './pages/ChatbotPage';

// 💎 3. สร้าง Component สำหรับควบคุมเพลง
const MusicPlayer = () => {
  const { isMusicPlaying } = useAppContext();
  const audioRef = useRef(null);

  useEffect(() => {
    // ใช้ effect นี้เพื่อ "สั่งการ" เครื่องเล่นเพลง
    if (audioRef.current) {
      if (isMusicPlaying) {
        // ลองเล่นเพลง
        audioRef.current.play().catch(error => console.warn("Music autoplay blocked:", error));
      } else {
        // หยุดเพลง
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]); // 👈 ทำงานทุกครั้งที่ isMusicPlaying เปลี่ยน

  return (
    <audio 
      ref={audioRef}
      src="/lofii.mp3" // 🔴 !! สำคัญ: เปลี่ยนเป็นชื่อไฟล์เพลงของคุณ !!
      loop // 👈 ทำให้เพลงลูป
      preload="auto"
    />
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); 

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'calendar':
        return (
          <Layout setCurrentPage={setCurrentPage}>
            <CalendarPage />
          </Layout>
        );
      case 'chatbot':
        return (
          <Layout setCurrentPage={setCurrentPage}>
            <ChatbotPage />
          </Layout>
        );
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      {renderPage()}
      {/* 💎 4. เพิ่มเครื่องเล่นเพลง (ที่ซ่อนอยู่) เข้าไปใน App */}
      <MusicPlayer /> 
    </AppProvider>
  );
}