import React from 'react';
import { FiShield, FiCpu, FiEye, FiTrendingUp, FiZap, FiAward, FiTarget } from 'react-icons/fi';

const About: React.FC = () => {
  const features = [
    {
      icon: <FiEye className="w-5 h-5" />,
      title: "AI Detection",
      description: "Advanced species classification using YOLOv8"
    },
    {
      icon: <FiTrendingUp className="w-5 h-5" />,
      title: "Coverage Analysis",
      description: "Precise fouling density measurement"
    },
    {
      icon: <FiCpu className="w-5 h-5" />,
      title: "Growth Prediction",
      description: "LSTM-powered fouling progression forecasts"
    },
    {
      icon: <FiZap className="w-5 h-5" />,
      title: "Impact Assessment",
      description: "Real-time fuel cost and operational analysis"
    }
  ];

  const stats = [
    { value: "85%", label: "Faster Inspection" },
    { value: "60%", label: "Better Efficiency" },
    { value: "40%", label: "Cost Savings" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiShield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">FoulingGuard AI</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intelligent Marine Biofouling Detection & Decision Support System
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Marine biofouling causes significant operational challenges for naval vessels, including increased drag, 
              reduced speed, higher fuel consumption, and elevated maintenance costs.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["Increased Drag", "Reduced Speed", "Higher Fuel Costs", "Maintenance Issues"].map((issue, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <span className="text-red-700 text-sm font-medium">{issue}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Solution</h3>
            <p className="text-gray-600 mb-6">
              AI-powered detection and analysis system that provides real-time insights and actionable recommendations for marine fouling management.
            </p>
            <div className="flex items-center gap-2">
              <FiTarget className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Built for Indian Navy Operations</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Capture</h3>
              <p className="text-gray-600 text-sm">Upload hull images or use live camera feed</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Analyze</h3>
              <p className="text-gray-600 text-sm">AI processes images for species detection and coverage analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Report</h3>
              <p className="text-gray-600 text-sm">Get detailed reports with cleaning recommendations</p>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <FiAward className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Expected Impact</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Built With Modern Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "AI/ML", tech: "PyTorch, YOLOv8, U-Net" },
              { name: "Frontend", tech: "React, TypeScript" },
              { name: "Analysis", tech: "Computer Vision, LSTM" },
              { name: "Data", tech: "Python, NumPy, Pandas" }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
