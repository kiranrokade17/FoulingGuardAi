import React, { useState, useRef, useEffect } from 'react';
import { getSpeciesModelPath } from '../config/speciesModels';

interface ModelViewerProps {
  species: string;
  className?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  species, 
  className = "w-full h-full"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelError, setModelError] = useState(false);
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use the configuration-based model path
  const modelPath = getSpeciesModelPath(species);

  useEffect(() => {
    console.log(`🎨 Attempting to load 3D model for: ${species}`);
    console.log(`📁 Model path: ${modelPath}`);

    // Check if model-viewer is available
    const checkModelViewer = () => {
      if (typeof window !== 'undefined' && window.customElements) {
        return window.customElements.get('model-viewer') !== undefined;
      }
      return false;
    };

    // Load model-viewer if not already loaded
    if (!checkModelViewer()) {
      console.log('📦 Loading model-viewer library...');
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      script.onload = () => {
        console.log('✅ Model-viewer library loaded');
        setTimeout(() => {
          setModelViewerReady(true);
          setIsLoading(false);
        }, 500);
      };
      script.onerror = () => {
        console.error('❌ Failed to load model-viewer library');
        setModelError(true);
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      console.log('✅ Model-viewer already available');
      setModelViewerReady(true);
      setIsLoading(false);
    }

    return () => {
      // Cleanup if needed
    };
  }, [species, modelPath]);

  useEffect(() => {
    if (modelViewerReady && containerRef.current) {
      console.log(`🎨 Creating model-viewer element for: ${species}`);
      
      // Create model-viewer element dynamically
      const modelViewer = document.createElement('model-viewer');
      modelViewer.setAttribute('src', modelPath);
      modelViewer.setAttribute('alt', `3D model of ${species}`);
      modelViewer.setAttribute('auto-rotate', '');
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('shadow-intensity', '1');
      modelViewer.setAttribute('environment-image', 'neutral');
      modelViewer.style.width = '100%';
      modelViewer.style.height = '100%';
      modelViewer.style.borderRadius = '12px';
      modelViewer.setAttribute('loading', 'eager');
      modelViewer.setAttribute('reveal', 'auto');
      
      // Add event listeners with detailed logging
      modelViewer.addEventListener('load', () => {
        console.log('✅ 3D model loaded successfully:', species);
        console.log('📁 Model source:', modelPath);
      });
      
      modelViewer.addEventListener('error', (event: any) => {
        console.error('❌ Error loading 3D model:', species);
        console.error('📁 Failed model path:', modelPath);
        console.error('🔥 Error details:', event);
        setModelError(true);
      });
      
      modelViewer.addEventListener('progress', (event: any) => {
        const progress = event.detail?.totalProgress || 0;
        console.log(`📁 Loading progress for ${species}: ${Math.round(progress * 100)}%`);
      });
      
      // Test if file exists first (simple check)
      fetch(modelPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log('✅ Model file exists:', modelPath);
          } else {
            console.error('❌ Model file not found:', modelPath, 'Status:', response.status);
            setModelError(true);
            return;
          }
        })
        .catch(error => {
          console.error('❌ Error checking model file:', error);
          setModelError(true);
          return;
        });
      
      // Clear container and add model viewer
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(modelViewer);
      
      console.log('🏗️ Model-viewer element added to DOM');
    }
  }, [modelViewerReady, species, modelPath]);

  if (modelError) {
    return (
      <div className={`${className} relative`}>
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-3">🔬</div>
            <p className="text-lg font-bold text-gray-800">{species}</p>
            <p className="text-sm text-gray-600 mt-2">3D Model</p>
            <p className="text-xs text-gray-400 mt-1">Interactive model loading...</p>
            <button 
              onClick={() => window.open(`/test-3d.html`, '_blank')}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Test 3D Viewer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !modelViewerReady) {
    return (
      <div className={`${className} relative`}>
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-base font-medium text-gray-700">Loading 3D Model</p>
            <p className="text-sm text-gray-500">{species}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50"
      />
      
      {/* Controls overlay */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-white text-xs font-medium text-center">
            🎮 Drag to rotate • Scroll to zoom • {species}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;