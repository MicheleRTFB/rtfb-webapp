import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flag, 
  Users, 
  Dumbbell, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Timer
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/athletes', icon: Users, label: 'I Miei Atleti' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/races', icon: Flag, label: 'Gare' },
    { path: '/race-widget', icon: Timer, label: 'Countdown Gare' },
    { path: '/widgets', icon: Dumbbell, label: 'Widgets' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`
        fixed left-0 top-0 h-screen bg-[#1E40AF]
        ${isCollapsed ? 'w-20' : 'w-64'}
        transition-all duration-300 ease-in-out
        flex flex-col
      `}
    >
      {/* Logo e Toggle */}
      <div className="p-4 relative">
        <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-28'}`}>
          <img 
            src="/rtfb bianco.png" 
            alt="Run To Feel Better" 
            className="w-full h-auto"
          />
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-1 p-1 bg-white hover:bg-opacity-80 rounded-full transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} className="text-[#1E40AF]" /> : <ChevronLeft size={16} className="text-[#1E40AF]" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center px-6 py-3 text-white
              transition-colors duration-200
              ${isActive(item.path) 
                ? 'bg-white bg-opacity-10' 
                : 'hover:bg-white hover:bg-opacity-5'
              }
            `}
          >
            <item.icon size={24} />
            {!isCollapsed && (
              <span className="ml-4 text-lg">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className={`
        p-4 border-t border-white border-opacity-10
        flex items-center
        ${isCollapsed ? 'justify-center' : 'px-6'}
      `}>
        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <p className="text-white font-medium">Michele Stefani</p>
            <p className="text-white text-opacity-60 text-sm">falispi@gmail.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 