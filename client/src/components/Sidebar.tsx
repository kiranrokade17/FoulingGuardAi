import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUpload, FiFileText, FiMessageCircle, FiInfo, FiMap } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/upload', label: 'Upload', icon: <FiUpload /> },
  { to: '/reports', label: 'Reports', icon: <FiFileText /> },
  { to: '/chatbot', label: 'Chatbot', icon: <FiMessageCircle /> },
  { to: '/crowdsourced-map', label: 'Crowdsourced Map', icon: <FiMap /> },
  { to: '/about', label: 'About', icon: <FiInfo /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="hidden md:flex md:flex-col bg-gray-900 text-white w-56 h-screen py-6 px-4 fixed left-0 top-0 z-10">
      <div className="mb-8 text-xl font-bold text-center">
        FoulingGuard AI
      </div>
      <nav className="flex flex-col gap-3">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:scale-[1.03] hover:bg-blue-600/20 ${location.pathname === item.to ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-200'}`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
