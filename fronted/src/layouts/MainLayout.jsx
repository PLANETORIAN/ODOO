import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;