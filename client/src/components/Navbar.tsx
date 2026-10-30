import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUpload, FiFileText, FiMessageCircle, FiInfo } from 'react-icons/fi';

const Navbar: React.FC = () => (
  <nav className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Link to="/" className="flex items-center gap-1 font-bold text-lg"><FiHome /> Marine Biofouling DSS</Link>
    </div>
    <div className="flex gap-6">
      <Link to="/upload" className="flex items-center gap-1 hover:text-blue-400"><FiUpload /> Upload</Link>
      <Link to="/reports" className="flex items-center gap-1 hover:text-blue-400"><FiFileText /> Reports</Link>
      <Link to="/chatbot" className="flex items-center gap-1 hover:text-blue-400"><FiMessageCircle /> Chatbot</Link>
      <Link to="/about" className="flex items-center gap-1 hover:text-blue-400"><FiInfo /> About</Link>
    </div>
  </nav>
);

export default Navbar;
