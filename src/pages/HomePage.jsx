import React from 'react';

const HomePage = ({ setCurrentPage }) => {
  const gifPath = '/sheep.gif'; // !! อย่าลืมเปลี่ยนชื่อไฟล์ GIF ของคุณ !!

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
      
      {/* ฟองอากาศ (Bubbles) ยังอยู่เหมือนเดิม */}
      <div 
        className="absolute top-10 left-10 w-48 h-48 bg-pink-200 rounded-full animate-pulse-slow"
        style={{ animationDelay: '0s' }}
      ></div>
      
      <div 
        className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-float-up"
        style={{ animationDelay: '2s' }}
      ></div>

      <div 
        className="absolute bottom-10 left-20 w-24 h-24 bg-pink-200 rounded-full animate-float-up"
        style={{ animationDelay: '1s' }}
      ></div>

      <div 
        className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full animate-pulse-slow"
        style={{ animationDelay: '3s' }}
      ></div>
      

      {/* --- 💎 จุดที่แก้ไข: ลบ 'rounded-lg' และ 'shadow-xl' ออก --- */}
      {/* และปรับ 'mb-8' เป็น 'mb-4' เพื่อปรับระยะห่างของปุ่ม */}
      <img 
        src={gifPath} 
        alt="Animated Greeting" 
        className="z-10 w-64 md:w-80 lg:w-96 mb-4" // ลบ rounded-lg และ shadow-xl ออก
      />
      
      {/* --- ปุ่ม Click --- */}
      <button
        onClick={() => setCurrentPage('calendar')}
        className="z-10 px-10 py-4 bg-pink-300 text-white font-semibold rounded-full shadow-lg transform transition-transform hover:scale-105 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
      >
        Click
      </button>
    </div>
  );
};
export default HomePage;