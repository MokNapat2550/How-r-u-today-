import React from 'react';
import { Home, MessageCircle, Phone } from 'lucide-react';

const BottomNav = ({ setCurrentPage }) => {
  const navItems = [
    { name: 'Home', page: 'calendar', icon: Home },
    { name: 'Chatbot', page: 'chatbot', icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center shadow-inner">
      {navItems.map(item => (
        <button
          key={item.name}
          onClick={() => setCurrentPage(item.page)}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-pink-400"
        >
          <item.icon size={24} />
          <span className="text-xs mt-1">{item.name}</span>
        </button>
      ))}
      <a
        href="tel:1323"
        className="flex flex-col items-center justify-center text-gray-600 hover:text-pink-400"
      >
        <Phone size={24} />
        <span className="text-xs mt-1">Call</span>
      </a>
    </nav>
  );
};
export default BottomNav;