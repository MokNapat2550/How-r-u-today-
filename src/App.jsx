import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ChatbotPage from './pages/ChatbotPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'calendar', 'chatbot'

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
    // <AppProvider> จะทำให้ทุกหน้าเข้าถึงข้อมูล (moods, plans, notes) ได้
    <AppProvider>
      {renderPage()}
    </AppProvider>
  );
}