
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomBar from './components/BottomBar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ImageUpload from './pages/ImageUpload';
import Report from './pages/Report';
import Reports from './pages/Reports';
import Chatbot from './pages/Chatbot';
import About from './pages/About';
import RemoteCapture from './pages/RemoteCapture';
import CrowdsourcedMap from './pages/CrowdsourcedMap';
import SpeciesModelAdmin from './components/SpeciesModelAdmin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/remote-capture" element={<RemoteCapture />} />
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 bg-gray-50 pb-16 md:pb-0 md:ml-56">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<ImageUpload />} />
                <Route path="/report" element={<Report />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/crowdsourced-map" element={<CrowdsourcedMap />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin/models" element={<SpeciesModelAdmin />} />
              </Routes>
            </main>
            <BottomBar />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;