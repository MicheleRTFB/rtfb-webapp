import React from 'react';
import { Bell, Settings } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="h-[72px] bg-white flex items-center justify-start px-8 fixed right-0 top-0 left-[280px] z-10">
      <div className="flex items-center space-x-8">
        {/* Saluto Utente */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-gray-900">Ciao michele Stefani</span>
            <span className="ml-2">👋</span>
          </div>
        </div>

        {/* Icone Utility */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 