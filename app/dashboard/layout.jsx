"use client";
import React, { useState } from 'react';
import Sidebar from './_components/Sidebar';
import { Menu } from 'lucide-react';

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <button
        className="md:hidden p-4 text-primary"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
      <div
        className={`fixed inset-0 z-10 bg-gray-800 bg-opacity-75 ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className='hidden md:block md:w-64 h-full'>
        <Sidebar />
      </div>
      <div className='flex-1 md:mt-0 p-4'>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
