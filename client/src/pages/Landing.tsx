import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiTrendingUp, FiZap, FiArrowRight,FiAward, FiFileText, FiMessageCircle } from 'react-icons/fi';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
                <FiAward className="w-4 h-4" />
                <span className="text-sm">Powered By FoulingGuard AI</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Next-Generation
                <span className="text-blue-400"> Marine Intelligence</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform your naval operations with AI-powered biofouling detection. Reduce costs by 40%, improve efficiency by 85%, and ensure mission readiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started <FiArrowRight />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs">Analysis Complete</span>
                    </div>
                    <span className="text-xs text-gray-300">Report #RPT-001</span>
                  </div>
                  <div className="text-lg font-bold mb-1">INS Vikrant - Hull Analysis</div>
                  <div className="text-xs text-gray-300 mb-3">Starboard Hull Section A-7</div>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Species Detected:</div>
                    <div className="flex gap-1 flex-wrap">
                      <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">Barnacles</span>
                      <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">Mussels</span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Algae</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-red-400">34.5%</div>
                    <div className="text-xs text-gray-400">Fouling Coverage</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-400">High</div>
                    <div className="text-xs text-gray-400">Criticality</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-yellow-400">8.2%</div>
                    <div className="text-xs text-gray-400">Fuel Penalty</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-400">67.8%</div>
                    <div className="text-xs text-gray-400">30-day Growth</div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">AI Recommendation:</div>
                  <div className="text-xs text-white">High-pressure water jet cleaning within 2 weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hackathon Innovation: AI Marine Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge prototype demonstrating the future of automated marine biofouling detection and analysis
            </p>
          </div>
          
          <div className="space-y-20">
            {/* Feature 1 - Image Left, Content Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FiEye className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Species Detection Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Barnacles</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Detected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mussels</span>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Detected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Algae</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Detected</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Species Detection</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  YOLOv8-powered detection system identifies barnacles, mussels, algae, and other fouling species with high accuracy using advanced computer vision algorithms.
                </p>
                <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Multi-Species Detection
                </div>
              </div>
            </div>

            {/* Feature 2 - Content Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTrendingUp className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Growth Prediction</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">7 Days</span>
                        <span className="text-lg font-bold text-orange-600">42.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">30 Days</span>
                        <span className="text-lg font-bold text-red-600">67.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full" style={{width: '67.8%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Predictive Growth Analytics</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  LSTM neural networks predict fouling growth patterns and maintenance requirements, helping optimize cleaning schedules and reduce operational costs.
                </p>
                <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Growth Forecasting
                </div>
              </div>
            </div>

            {/* Feature 3 - Image Left, Content Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FiZap className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Processing Status</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Analysis Time</span>
                      <span className="text-lg font-bold text-green-600">1.8s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-lg font-bold text-blue-600">94.2%</span>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-center text-sm font-medium">
                      ✓ Real-time Analysis Complete
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Real-Time Processing</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Instant image processing with immediate fouling assessment and cleaning recommendations. Get results in under 2 seconds for rapid decision making.
                </p>
                <div className="inline-block bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  Real-Time Analysis
                </div>
              </div>
            </div>

            {/* Feature 4 - Content Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl p-8">
                  <div className="bg-black rounded-xl p-6 shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white">Live Camera Feed</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 mb-3">
                      <div className="text-center text-gray-400 text-sm mb-2">Camera Active</div>
                      <div className="w-full h-20 bg-gradient-to-r from-blue-900 to-green-900 rounded opacity-80"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Resolution: 1080p</span>
                      <span>FPS: 30</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Live Camera Integration</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Direct camera integration for real-time hull inspection. Capture images instantly or stream live video for continuous monitoring during underwater operations.
                </p>
                <div className="inline-block bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                  Live Streaming
                </div>
              </div>
            </div>

            {/* Feature 5 - Image Left, Content Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FiFileText className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Report Generated</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Report ID: RPT-001</div>
                      <div className="text-sm font-medium">INS Vikrant Analysis</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-100 text-red-700 p-2 rounded text-center">High Priority</div>
                      <div className="bg-yellow-100 text-yellow-700 p-2 rounded text-center">8.2% Fuel Impact</div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-center text-xs">
                      📊 Detailed Report Available
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Reports</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Generate detailed analysis reports with species identification, coverage metrics, fuel impact calculations, and actionable cleaning recommendations.
                </p>
                <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Automated Reporting
                </div>
              </div>
            </div>

            {/* Feature 6 - Content Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <FiMessageCircle className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">AI Assistant</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-lg p-3 text-sm">
                        <div className="text-xs text-gray-500 mb-1">You:</div>
                        <div>What cleaning method do you recommend?</div>
                      </div>
                      <div className="bg-blue-100 rounded-lg p-3 text-sm">
                        <div className="text-xs text-blue-600 mb-1">AI Assistant:</div>
                        <div>Based on 34.5% barnacle coverage, I recommend high-pressure water jet cleaning within 2 weeks.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Assistant</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Interactive AI chatbot provides expert guidance on fouling management, cleaning strategies, and maintenance scheduling based on analysis results.
                </p>
                <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Smart Recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-gray-100 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 FoulingGuard AI - Hackathon Innovation Project
        </p>
      </div>

    </div>
  );
};

export default Landing;