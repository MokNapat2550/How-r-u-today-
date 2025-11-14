import React from 'react';

// 💎 แก้ไขไฟล์นี้ครับ
const HomePage = ({ setCurrentPage }) => {
  return (
    // --- 💎 1. เพิ่ม relative และ overflow-hidden ---
    // relative เพื่อให้ "ลูกเล่น" ที่เราจะเพิ่ม ยึดเกาะกับหน้านี้
    // overflow-hidden เพื่อไม่ให้ "ลูกเล่น" ล้นออกมา
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 overflow-hidden">
      
      {/* --- 💎 2. นี่คือ "ลูกเล่น" ที่เพิ่มเข้ามาครับ --- */}
      {/* เราจะสร้าง "ฟองอากาศ" ลอยๆ 
        โดยใช้คลาส animate-pulse-slow และ animate-float-up
        ที่เราเพิ่งไปกำหนดใน index.css ครับ
      */}

      {/* ฟองอากาศสีชมพู ดวงใหญ่ (ซ้ายบน) */}
      <div 
        className="absolute top-10 left-10 w-48 h-48 bg-pink-200 rounded-full animate-pulse-slow"
        style={{ animationDelay: '0s' }} // ให้เริ่มไม่พร้อมกัน
      ></div>
      
      {/* ฟองอากาศสีฟ้า ดวงกลาง (ขวาบน) */}
      <div 
        className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-float-up"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* ฟองอากาศสีชมพู ดวงเล็ก (ซ้ายล่าง) */}
      <div 
        className="absolute bottom-10 left-20 w-24 h-24 bg-pink-200 rounded-full animate-float-up"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* ฟองอากาศสีฟ้า ดวงเล็ก (ขวาล่าง) */}
      <div 
        className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full animate-pulse-slow"
        style={{ animationDelay: '3s' }}
      ></div>
      

      {/* --- 💎 3. เนื้อหาเดิม (แต่เพิ่ม z-index) --- */}
      {/* เราเพิ่ม 'z-10' เพื่อให้แน่ใจว่าข้อความและปุ่ม
        จะ "ลอยอยู่เหนือ" ฟองอากาศที่เราสร้างขึ้น
      */}
      <h1 className="z-10 text-5xl font-bold text-gray-700 mb-8">
        How r u today?
      </h1>
      
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