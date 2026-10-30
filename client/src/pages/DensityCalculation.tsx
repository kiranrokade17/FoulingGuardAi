import React, { useRef, useState } from 'react';
import { FiUpload, FiBarChart, FiActivity, FiTarget, FiInfo } from 'react-icons/fi';

interface DensityAnalysis {
  density_percentage: number;
  severity: string;
  recommendation: string;
  total_pixels: number;
  fouling_pixels: number;
  threshold_method: string;
  fuel_impact_estimate: number;
  cleaning_urgency: string;
}

const DensityCalculation: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [densityAnalysis, setDensityAnalysis] = useState<DensityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setDensityAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDensity = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const response = await fetch(`${apiUrl}/api/ai/calculate-density`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ image })
      });
      
      if (response.ok) {
        const result = await response.json();
        setDensityAnalysis(result.density_analysis);
      } else {
        const error = await response.json();
        setError(error.error || 'Density calculation failed');
      }
    } catch (err) {
      setError('Network error. Please check if services are running.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDensityBarColor = (percentage: number) => {
    if (percentage > 70) return 'bg-red-500';
    if (percentage > 40) return 'bg-orange-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <FiBarChart className="text-blue-600" />
            Fouling Density Calculator
          </h1>
          <p className="text-gray-600">
            Advanced density analysis using Otsu thresholding algorithm for precise fouling measurement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiUpload className="text-blue-600" /> Upload Hull Image
            </h2>
            
            {image ? (
              <div className="space-y-4">
                <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
                  <img 
                    src={image} 
                    alt="Selected" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <p className="text-green-700 font-medium mb-2">Image Ready for Analysis</p>
                    <button
                      onClick={() => {
                        setImage(null);
                        setDensityAnalysis(null);
                        setError(null);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Choose Different Image
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={calculateDensity}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <FiActivity />
                      Calculate Density
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <FiUpload className="text-4xl text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Select hull image for density analysis</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  Choose Image File
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">❌ {error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {densityAnalysis ? (
              <>
                {/* Main Density Result */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FiTarget className="text-green-600" /> Density Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {densityAnalysis.density_percentage}%
                      </div>
                      <p className="text-gray-600">Fouling Coverage Density</p>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-1000 ${getDensityBarColor(densityAnalysis.density_percentage)}`}
                        style={{ width: `${Math.min(densityAnalysis.density_percentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border text-center font-medium ${getSeverityColor(densityAnalysis.severity)}`}>
                      Severity Level: {densityAnalysis.severity.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Total Pixels</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {densityAnalysis.total_pixels.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Fouling Pixels</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {densityAnalysis.fouling_pixels.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Algorithm</p>
                      <p className="text-lg font-bold text-green-700 uppercase">
                        {densityAnalysis.threshold_method}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Fuel Impact</p>
                      <p className="text-2xl font-bold text-red-700">
                        +{densityAnalysis.fuel_impact_estimate}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiInfo className="text-purple-600" /> Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-700 mb-2">Action Required:</p>
                      <p className="text-purple-600">{densityAnalysis.recommendation}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-700 mb-2">Urgency Level:</p>
                      <p className="text-gray-600 capitalize">{densityAnalysis.cleaning_urgency}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <FiBarChart className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analysis Yet</h3>
                <p className="text-gray-600">Upload an image and click "Calculate Density" to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">About Otsu Thresholding</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">How it works:</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Converts image to grayscale</li>
                <li>• Automatically determines optimal threshold</li>
                <li>• Separates fouling from hull surface</li>
                <li>• Calculates pixel density ratio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Advantages:</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Fully automated process</li>
                <li>• No manual parameter tuning</li>
                <li>• Consistent across lighting conditions</li>
                <li>• Industry-standard algorithm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DensityCalculation;