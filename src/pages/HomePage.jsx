import React, { useState } from 'react';
import adsgif from '../assets/moods/ads.gif';

const styles = `
    @keyframes pulse-slow {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
    }
    .animate-pulse-slow {
        animation: pulse-slow 6s infinite ease-in-out;
    }


    @keyframes float-up {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    .animate-float-up {
        animation: float-up 5s infinite ease-in-out;
    }

    .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .shadow-3xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .animate-bounce-slow {
        animation: bounce 4s infinite;
    }
    @keyframes bounce {
        0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
    }
`;

const X = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);
const Gift = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v9" /><path d="M5 12v9" /><path d="M10 8h4v-3h-4z" />
    </svg>
);

// Ad Modal Component
const AdModal = ({ onClose, setCurrentPage }) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-2xl shadow-3xl w-full max-w-sm p-6 relative animate-fadeIn transition-transform transform scale-100">
                
                {/* Close Button (กากบาท) */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 bg-white rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition shadow-lg"
                    title="ปิดโฆษณา"
                >
                    <X size={24} />
                </button>

                <div className="text-center space-y-4">
                   <img src={adsgif} alt="adsimg" />
                   <h1  className='text-2xl mb-50px'>Welcome to Engine Nebula</h1>
                   
                </div>
            </div>
        </div>
    );
};


const HomePage = ({ setCurrentPage }) => {
    // 1. State เพื่อควบคุมการแสดง Pop-up
    const [showAd, setShowAd] = useState(true);
    const gifPath = '/sheep.gif'; // !! อย่าลืมเปลี่ยนชื่อไฟล์ GIF ของคุณ !!

    // 2. ฟังก์ชันสำหรับปิด Pop-up
    const handleAdClose = () => {
        setShowAd(false);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
             {/* Load Tailwind CSS and custom styles */}
            <script src="https://cdn.tailwindcss.com"></script>
            <style dangerouslySetInnerHTML={{ __html: styles }} />

            {/* Background Animations */}
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

            <img 
                src={gifPath} 
                alt="Animated Greeting" 
                className="z-10 w-64 md:w-80 lg:w-96 mb-4"
            />

            <button
                onClick={() => setCurrentPage('calendar')}
                className="z-10 px-10 py-4 bg-pink-300 text-white font-semibold rounded-full shadow-lg transform transition-transform hover:scale-105 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
                Click
            </button>

            {/* 3. แสดง Ad Modal หาก showAd เป็น true */}
            {showAd && (
                <AdModal 
                    onClose={handleAdClose} 
                    setCurrentPage={setCurrentPage} 
                />
            )}
        </div>
    );
};

export default HomePage;