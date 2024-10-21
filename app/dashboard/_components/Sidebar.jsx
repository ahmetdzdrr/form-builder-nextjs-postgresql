import { LibraryBig, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const menuList = [
    {
      id: 1,
      name: 'Formlarım',
      icon: LibraryBig,
      path: '/dashboard',
    },
    {
      id: 2,
      name: 'Form Cevaplarım',
      icon: MessageSquare,
      path: '/dashboard/responses',
    },
  ];

  const path = usePathname();

  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-md z-20 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <button 
        className='absolute top-4 right-4 text-gray-600 md:hidden'
        onClick={toggleSidebar}
      >
        <X size={24} />
      </button>

      <div className='p-5'>
        <div className='mt-12 md:mt-6'>
          {menuList.map((menu) => (
            <Link 
              href={menu.path} 
              key={menu.id} 
              className={`flex items-center gap-3 p-4 mb-3 hover:text-white hover:bg-black/30 rounded-lg ${
                path === menu.path ? 'bg-primary text-white' : ''
              }`}
            >
              <menu.icon className="w-5 h-5" />
              {menu.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
