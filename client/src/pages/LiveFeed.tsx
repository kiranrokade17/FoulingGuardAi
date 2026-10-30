import React from 'react';
import { FiVideo } from 'react-icons/fi';

const LiveFeed: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <FiVideo className="mr-2" /> Live Feed (Demo)
    </h2>
    <p>Simulated live analysis.</p>
  </div>
);

export default LiveFeed;
