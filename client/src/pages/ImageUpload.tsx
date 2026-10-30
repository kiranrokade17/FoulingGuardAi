import React, { useRef, useState, useEffect } from 'react';
import { FiUpload, FiCamera, FiVideo, FiImage, FiSmartphone, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { websocketService } from '../services/websocketService';

const ImageUpload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'upload' | 'live' | 'remote'>('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [showLocationInput, setShowLocationInput] = useState(false);

  const createUrlParams = (data: any) => {
    return new URLSearchParams({
      reportId: data.reportId,
      vessel: data.vessel,
      species: data.species,
      density: data.density.toString(),
      criticality: data.criticality,
      fuelPenalty: data.fuelPenalty.toString(),
      method: data.method,
      urgency: data.urgency,
      note: data.note
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      setShowLocationInput(true);
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log('🤖 AI Analysis Request to:', `${apiUrl}/api/ai/analyze`);
      
      const analysisData = {
        image: capturedImage,
        location: location,
        vessel: 'MV Ocean Explorer'
      };
      
      const response = await fetch(`${apiUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(analysisData)
      });
      
      console.log('📡 Response:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ AI Analysis Complete:', result.analysis);
        
        // Navigate with real analysis data
        const params = createUrlParams({
          reportId: result.report.reportId,
          vessel: result.report.vessel,
          species: result.report.species,
          density: result.report.density || result.report.coverage, // Handle both density and coverage for compatibility
          criticality: result.report.criticality,
          fuelPenalty: result.report.fuelPenalty,
          method: result.report.method,
          urgency: result.report.urgency,
          note: result.report.note
        });
        navigate(`/report?${params.toString()}`);
      } else {
        const error = await response.json();
        console.error('❌ Analysis failed:', error);
        alert(`Analysis failed: ${error.error}`);
      }
    } catch (error) {
      console.log('🔥 API Error:', error);
      alert('Connection failed. Please check if services are running.');
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setCapturedImage(null);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
      }
    }
  };

  const analyzeCapture = async () => {
    if (!location.lat || !location.lng) {
      setShowLocationInput(true);
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log('🤖 AI Analysis Request (Live):', `${apiUrl}/api/ai/analyze`);
      
      const analysisData = {
        image: capturedImage,
        location: location,
        vessel: 'MV Ocean Explorer'
      };
      
      const response = await fetch(`${apiUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(analysisData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Live AI Analysis Complete:', result.analysis);
        
        const params = createUrlParams({
          reportId: result.report.reportId,
          vessel: result.report.vessel,
          species: result.report.species,
          density: result.report.density || result.report.coverage,
          criticality: result.report.criticality,
          fuelPenalty: result.report.fuelPenalty,
          method: result.report.method,
          urgency: result.report.urgency,
          note: result.report.note
        });
        navigate(`/report?${params.toString()}`);
      } else {
        const error = await response.json();
        console.error('❌ Live analysis failed:', error);
        alert(`Analysis failed: ${error.error}`);
      }
    } catch (error) {
      console.log('🔥 Live API Error:', error);
      alert('Connection failed. Please check if services are running.');
    }
  };

  const generateQRCode = () => {
    if (sessionId) {
      websocketService.disconnect();
    }
    
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const remoteUrl = `${frontendUrl}/remote-capture?session=${newSessionId}`;
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(remoteUrl)}`;
    setQrCode(qrUrl);
  };

  useEffect(() => {
    if (!sessionId) return;
    
    const handleMessage = (data: any) => {
      if (data.type === 'image') {
        setRemoteImage(data.data);
        
        const notification = document.createElement('div');
        notification.innerHTML = `📱 Image received from remote device!`;
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:green;color:white;padding:10px;border-radius:5px;z-index:9999';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    };
    
    websocketService.connect(sessionId, handleMessage);
    
    return () => {
      websocketService.disconnect();
    };
  }, [sessionId]);

  const analyzeRemoteImage = async () => {
    if (!location.lat || !location.lng) {
      setShowLocationInput(true);
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log('🤖 AI Analysis Request (Remote):', `${apiUrl}/api/ai/analyze`);
      
      const analysisData = {
        image: remoteImage,
        location: location,
        vessel: 'MV Ocean Explorer'
      };
      
      const response = await fetch(`${apiUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(analysisData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Remote AI Analysis Complete:', result.analysis);
        
        const params = createUrlParams({
          reportId: result.report.reportId,
          vessel: result.report.vessel,
          species: result.report.species,
          coverage: result.report.coverage,
          criticality: result.report.criticality,
          fuelPenalty: result.report.fuelPenalty,
          method: result.report.method,
          urgency: result.report.urgency,
          note: result.report.note
        });
        navigate(`/report?${params.toString()}`);
      } else {
        const error = await response.json();
        console.error('❌ Remote analysis failed:', error);
        alert(`Analysis failed: ${error.error}`);
      }
    } catch (error) {
      console.log('🔥 Remote API Error:', error);
      alert('Connection failed. Please check if services are running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hull Analysis</h1>
          <p className="text-gray-600">Upload an image or capture live footage for AI-powered fouling detection</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg flex">
            <button
              onClick={() => setMode('upload')}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                mode === 'upload' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FiImage className="inline mr-1" /> Upload
            </button>
            <button
              onClick={() => setMode('live')}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                mode === 'live' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FiVideo className="inline mr-1" /> Live
            </button>
            <button
              onClick={() => setMode('remote')}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                mode === 'remote' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FiSmartphone className="inline mr-1" /> Remote
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col">
            {mode === 'upload' ? (
              <div className="flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiUpload className="text-blue-600" /> Upload Hull Image
                </h2>
                <form onSubmit={handleUpload} className="flex flex-col flex-1 justify-between space-y-6">
                  {capturedImage ? (
                    <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
                      <img 
                        src={capturedImage} 
                        alt="Selected" 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="text-center">
                        <p className="text-green-700 font-medium mb-2">Image Selected</p>
                        <button
                          type="button"
                          onClick={() => setCapturedImage(null)}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Choose Different Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <FiUpload className="text-4xl text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Drag and drop your hull image here, or click to browse</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setCapturedImage(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                  {showLocationInput && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 mb-3 font-medium">📍 Coordinates Required</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Latitude"
                          value={location.lat || ''}
                          onChange={(e) => setLocation({...location, lat: parseFloat(e.target.value) || 0})}
                          className="p-2 border border-blue-300 rounded-lg text-sm"
                          step="any"
                        />
                        <input
                          type="number"
                          placeholder="Longitude"
                          value={location.lng || ''}
                          onChange={(e) => setLocation({...location, lng: parseFloat(e.target.value) || 0})}
                          className="p-2 border border-blue-300 rounded-lg text-sm"
                          step="any"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((pos) => {
                              setLocation({
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude
                              });
                            });
                          }
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        📍 Use Current Location
                      </button>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Analyze Image
                  </button>
                </form>
              </div>
            ) : mode === 'live' ? (
              <div className="flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiCamera className="text-green-600" /> Live Camera Feed
                </h2>
                <div className="bg-gray-900 rounded-xl flex-1 flex items-center justify-center mb-6 overflow-hidden relative">
                  {capturedImage ? (
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : cameraActive && stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover rounded-xl bg-black"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <FiCamera className="text-6xl mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera will appear here</p>
                      <p className="text-sm opacity-75">Click start to access camera</p>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-3">
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
                    >
                      Start Camera
                    </button>
                  ) : capturedImage ? (
                    <>
                      <button
                        onClick={() => setCapturedImage(null)}
                        className="px-6 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors"
                      >
                        Retake
                      </button>
                      {showLocationInput && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700 mb-3 font-medium">📍 Coordinates Required</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              placeholder="Latitude"
                              value={location.lat || ''}
                              onChange={(e) => setLocation({...location, lat: parseFloat(e.target.value) || 0})}
                              className="p-2 border border-blue-300 rounded-lg text-sm"
                              step="any"
                            />
                            <input
                              type="number"
                              placeholder="Longitude"
                              value={location.lng || ''}
                              onChange={(e) => setLocation({...location, lng: parseFloat(e.target.value) || 0})}
                              className="p-2 border border-blue-300 rounded-lg text-sm"
                              step="any"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((pos) => {
                                  setLocation({
                                    lat: pos.coords.latitude,
                                    lng: pos.coords.longitude
                                  });
                                });
                              }
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            📍 Use Current Location
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={analyzeCapture}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                      >
                        Analyze Image
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={stopCamera}
                        className="px-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium transition-colors"
                      >
                        Stop
                      </button>
                      <button
                        onClick={captureImage}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                      >
                        Capture Photo
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiSmartphone className="text-purple-600" /> Remote Capture
                </h2>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl flex-1 flex items-center justify-center mb-6 border-2 border-dashed border-purple-200 relative overflow-hidden">
                  {remoteImage ? (
                    <div className="text-center p-4">
                      <div className="relative">
                        <img 
                          src={remoteImage} 
                          alt="Remote capture" 
                          className="w-64 h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Image received from remote device
                        </p>
                      </div>
                    </div>
                  ) : qrCode ? (
                    <div className="text-center p-6">
                      <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 inline-block">
                        <img 
                          src={qrCode} 
                          alt="QR Code" 
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-700 font-medium mb-2">📱 Scan with device camera</p>
                        <p className="text-xs text-purple-600 font-mono bg-white px-2 py-1 rounded">Session: {sessionId}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        Waiting for device connection...
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="relative mb-6">
                        <FiSmartphone className="text-6xl text-purple-400 mx-auto mb-4" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <FiCamera className="text-purple-600 text-sm" />
                        </div>
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Remote Photo Capture</p>
                      <p className="text-sm text-gray-600 mb-4">Use mobile device as remote camera</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                        📱 Scan QR code with any mobile device
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {remoteImage ? (
                    <>
                      {showLocationInput && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700 mb-3 font-medium">📍 Coordinates Required</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              placeholder="Latitude"
                              value={location.lat || ''}
                              onChange={(e) => setLocation({...location, lat: parseFloat(e.target.value) || 0})}
                              className="p-2 border border-blue-300 rounded-lg text-sm"
                              step="any"
                            />
                            <input
                              type="number"
                              placeholder="Longitude"
                              value={location.lng || ''}
                              onChange={(e) => setLocation({...location, lng: parseFloat(e.target.value) || 0})}
                              className="p-2 border border-blue-300 rounded-lg text-sm"
                              step="any"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((pos) => {
                                  setLocation({
                                    lat: pos.coords.latitude,
                                    lng: pos.coords.longitude
                                  });
                                });
                              }
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            📍 Use Current Location
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={analyzeRemoteImage}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
                      >
                        Analyze Remote Image
                      </button>
                      <button
                        onClick={() => {
                          setRemoteImage(null);
                          setQrCode(null);
                          setSessionId(null);
                          websocketService.disconnect();
                        }}
                        className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Start New Session
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={generateQRCode}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {qrCode ? <FiRefreshCw /> : <FiSmartphone />}
                        {qrCode ? 'New Session' : 'Generate QR Code'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Species Detection</p>
                    <p className="text-sm text-gray-600">Identify barnacles, mussels, algae, and invasive species</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Coverage Analysis</p>
                    <p className="text-sm text-gray-600">Measure fouling density and affected areas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Impact Assessment</p>
                    <p className="text-sm text-gray-600">Calculate fuel penalties and cleaning costs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li>• Ensure good lighting conditions</li>
                <li>• Capture multiple angles of the hull</li>
                <li>• Use high-resolution images (min 1080p)</li>
                <li>• Avoid blurry or distorted images</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;