import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUpload, FiFileText, FiMessageCircle, FiInfo } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/upload', label: 'Upload', icon: <FiUpload /> },
  { to: '/reports', label: 'Reports', icon: <FiFileText /> },
  { to: '/chatbot', label: 'Chatbot', icon: <FiMessageCircle /> },
  { to: '/about', label: 'About', icon: <FiInfo /> },
];

const BottomBar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-gray-900/90 backdrop-blur-lg text-white justify-around py-2 border-t border-gray-800 shadow-lg">
      {navItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center text-xs px-2 transition-all duration-200 ${location.pathname === item.to ? 'text-blue-500 scale-110' : 'text-gray-300'}`}
        >
          <span className={`rounded-full p-2 ${location.pathname === item.to ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{item.icon}</span>
          <span className="mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomBar;
