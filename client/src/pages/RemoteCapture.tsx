import React, { useRef, useState, useEffect } from 'react';
import { FiCamera, FiUpload, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { websocketService } from '../services/websocketService';

// Extend Navigator interface for legacy getUserMedia
declare global {
  interface Navigator {
    getUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    webkitGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
  }
}

const RemoteCapture: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/upload');
      return;
    }
    
    // Connect to WebSocket session
    console.log('Connecting to WebSocket session:', sessionId);
    websocketService.connect(sessionId, (data) => {
      console.log('WebSocket message received:', data);
      setWsConnected(true);
    });
    
    startCamera();
    
    return () => {
      websocketService.disconnect();
    };
  }, [sessionId, navigate]);

  const startCamera = async () => {
    console.log('Debug info:', {
      hasNavigator: !!navigator,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
      protocol: location.protocol,
      hostname: location.hostname,
      userAgent: navigator.userAgent
    });

    // Check if mediaDevices is available (required for non-localhost)
    if (!navigator.mediaDevices) {
      alert('Camera access requires secure connection (HTTPS) or localhost. Current URL is not secure.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment'
        }
      });
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error: any) {
      console.error('Camera error:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
      } else {
        alert(`Camera access failed. Try using HTTPS or localhost instead.`);
      }
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const uploadImage = async () => {
    if (!capturedImage || !sessionId) return;
    
    try {
      // Compress image before sending
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Resize to max 800x600 to reduce size
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to 70% quality
        const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
        
        const message = {
          type: 'image',
          data: compressedImage,
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
          imageSize: compressedImage.length
        };
        
        console.log('Sending image via WebSocket:', {
          sessionId,
          imageSize: compressedImage.length,
          timestamp: message.timestamp
        });
        
        websocketService.sendMessage(message);
        
        alert(`Image sent! Size: ${Math.round(compressedImage.length/1024)}KB`);
        setCapturedImage(null);
      };
      
      img.src = capturedImage;
    } catch (error) {
      console.error('Failed to send image:', error);
      alert('Failed to send image. Please try again.');
    }
  };



  return (
    <div className="min-h-screen bg-black flex portrait:flex-col landscape:flex-row">
      {/* Camera Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
        ) : cameraActive && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : permissionDenied ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-white p-6">
              <FiCamera className="text-6xl mx-auto mb-4 text-red-400" />
              <p className="text-lg mb-4">Camera Permission Required</p>
              <p className="text-sm mb-6 opacity-75">Please allow camera access to capture images</p>
              <button
                onClick={() => {
                  setPermissionDenied(false);
                  startCamera();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Allow Camera Access
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <FiCamera className="text-6xl mx-auto mb-4 opacity-50" />
              <p className="text-lg">Starting camera...</p>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines */}
          <div className="absolute inset-4 border border-white/20">
            <div className="absolute top-1/3 left-0 right-0 border-t border-white/20"></div>
            <div className="absolute top-2/3 left-0 right-0 border-t border-white/20"></div>
            <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/20"></div>
            <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/20"></div>
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-white"></div>
          <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-white"></div>
          <div className="absolute portrait:bottom-32 landscape:bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-white"></div>
          <div className="absolute portrait:bottom-32 landscape:bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-white"></div>
        </div>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <button
              onClick={() => navigate('/upload')}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div className="text-center">
              <p className="text-sm font-medium">Hull Analysis</p>
              <p className="text-xs opacity-75">Session: {sessionId?.slice(-6)}</p>
              <div className={`flex items-center justify-center gap-1 mt-1 text-xs ${
                wsConnected ? 'text-green-400' : 'text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  wsConnected ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                {wsConnected ? 'Connected' : 'Connecting...'}
              </div>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>
      
      {/* Camera Controls */}
      <div className="bg-black portrait:p-6 landscape:p-4 landscape:w-32 landscape:flex landscape:flex-col landscape:justify-center">
        {capturedImage ? (
          <div className="flex portrait:flex-row landscape:flex-col items-center justify-center portrait:gap-6 landscape:gap-4">
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="portrait:w-16 portrait:h-16 landscape:w-12 landscape:h-12 rounded-full bg-gray-700 flex items-center justify-center text-white"
            >
              <FiRefreshCw className="portrait:text-xl landscape:text-lg" />
            </button>
            <button
              onClick={uploadImage}
              className="portrait:w-20 portrait:h-20 landscape:w-16 landscape:h-16 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg"
            >
              <FiUpload className="portrait:text-2xl landscape:text-xl" />
            </button>
            <div className="portrait:w-16 landscape:hidden"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={captureImage}
              disabled={!cameraActive}
              className="portrait:w-20 portrait:h-20 landscape:w-16 landscape:h-16 rounded-full bg-white border-4 border-gray-300 disabled:bg-gray-400 disabled:border-gray-500 shadow-lg active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-white"></div>
            </button>
          </div>
        )}
        
        {/* Capture hint */}
        <div className="text-center portrait:mt-4 landscape:mt-2">
          <p className="text-white/75 portrait:text-sm landscape:text-xs landscape:px-2">
            {capturedImage ? 'Tap ✓ to send' : 'Tap to capture'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemoteCapture;