import React from 'react';
const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-pink-100">
      <h1 className="text-5xl font-bold text-gray-700 mb-8 animate-pulse">
        How r u today?
      </h1>
      <button
        onClick={() => setCurrentPage('calendar')}
        className="px-10 py-4 bg-pink-300 text-white font-semibold rounded-full shadow-lg transform transition-transform hover:scale-105 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
      >
        Click
      </button>
    </div>
  );
};
export default HomePage;