import React, { useState } from 'react';
import { getSpeciesModelPath, speciesModelConfig, availableModels } from '../config/speciesModels';
import ModelViewer from './ModelViewer';

const SpeciesModelAdmin: React.FC = () => {
  const [testSpecies, setTestSpecies] = useState('Cliona Celata');
  const [previewSpecies, setPreviewSpecies] = useState('Cliona Celata');

  const handleTestSpecies = () => {
    setPreviewSpecies(testSpecies);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🎨 Species 3D Model Configuration
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Test Species */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🧪 Test Species Mapping</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Species Name:
                  </label>
                  <input
                    type="text"
                    value={testSpecies}
                    onChange={(e) => setTestSpecies(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Cliona Celata, Blue Mussel, barnacle"
                  />
                </div>
                <button
                  onClick={handleTestSpecies}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  🎯 Test Mapping & Preview
                </button>
                <div className="text-sm text-gray-600">
                  <strong>Current mapping:</strong><br />
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {testSpecies} → {getSpeciesModelPath(testSpecies).split('/').pop()}
                  </code>
                </div>
              </div>
            </div>

            {/* Available Models */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📦 Available 3D Models</h2>
              <div className="grid grid-cols-2 gap-2">
                {availableModels.map((model, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewSpecies(model.replace('.glb', ''))}
                    className="text-left p-2 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                  >
                    {model.replace('.glb', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">⚙️ Configuration Summary</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Exact Matches:</strong> {Object.keys(speciesModelConfig.exactMatches).length}
                </div>
                <div>
                  <strong>Aliases:</strong> {Object.keys(speciesModelConfig.aliases).length}
                </div>
                <div>
                  <strong>Partial Matches:</strong> {Object.keys(speciesModelConfig.partialMatches).length}
                </div>
                <div>
                  <strong>Default Model:</strong> {speciesModelConfig.defaultModel}
                </div>
              </div>
            </div>

            {/* Common Examples */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">💡 Test These Examples</h2>
              <div className="space-y-2">
                {[
                  'Cliona Celata',
                  'Blue Mussel', 
                  'barnacle',
                  'Unknown Species',
                  'tube worm',
                  'green algae'
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTestSpecies(example);
                      setPreviewSpecies(example);
                    }}
                    className="block w-full text-left p-2 rounded border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Model Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              🎮 3D Model Preview: <span className="text-blue-600">{previewSpecies}</span>
            </h2>
            <div className="h-96">
              <ModelViewer species={previewSpecies} className="w-full h-full" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <strong>Model Path:</strong><br />
              <code className="bg-gray-100 px-2 py-1 rounded break-all">
                {getSpeciesModelPath(previewSpecies)}
              </code>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 How to Customize Species-to-Model Mappings
          </h3>
          <div className="space-y-2 text-blue-800">
            <p>1. <strong>Edit the configuration file:</strong> <code>src/config/speciesModels.ts</code></p>
            <p>2. <strong>Add exact matches:</strong> Map specific species names to GLB files</p>
            <p>3. <strong>Add aliases:</strong> Map common names to GLB files</p>
            <p>4. <strong>Add partial matches:</strong> Map keywords to GLB files</p>
            <p>5. <strong>Set default model:</strong> Fallback model for unknown species</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesModelAdmin;