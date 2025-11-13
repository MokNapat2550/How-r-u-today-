import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children, setCurrentPage }) => {
  return (
    <div className="pb-16 min-h-screen bg-blue-50">
      {children}
      <BottomNav setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default Layout;