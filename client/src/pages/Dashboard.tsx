import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiFileText, FiMessageCircle,  FiShield, FiActivity, FiUsers } from 'react-icons/fi';

interface DashboardStats {
  totalReports: number;
  activeVessels: number;
  highPriority: number;
  avgFuelPenalty: number;
}

interface RecentReport {
  _id: string;
  reportId: string;
  vessel: string;
  criticality: string;
  timestamp: string;
}

const quickActions = [
  {
    title: 'Upload & Analyze',
    description: 'Upload hull images for AI-powered fouling detection',
    icon: <FiUpload className="w-6 h-6" />,
    link: '/upload',
    color: 'blue',
  },
  {
    title: 'View Reports',
    description: 'Access detailed analysis reports and recommendations',
    icon: <FiFileText className="w-6 h-6" />,
    link: '/reports',
    color: 'green',
  },
  {
    title: 'AI Assistant',
    description: 'Get expert guidance on fouling management',
    icon: <FiMessageCircle className="w-6 h-6" />,
    link: '/chatbot',
    color: 'purple',
  },
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };
  return colors[color as keyof typeof colors] || colors.blue;
};


const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({ totalReports: 0, activeVessels: 0, highPriority: 0, avgFuelPenalty: 0 });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        console.log('📊 Fetching dashboard data from:', apiUrl);
        
        // Fetch all reports
        const reportsResponse = await fetch(`${apiUrl}/api/reports`);
        if (reportsResponse.ok) {
          const reports = await reportsResponse.json();
          console.log('✅ Fetched reports for dashboard:', reports.length);
          
          // Calculate stats
          const totalReports = reports.length;
          const activeVessels = new Set(reports.map((r: any) => r.vessel)).size;
          const highPriority = reports.filter((r: any) => r.criticality === 'High').length;
          const avgFuelPenalty = reports.length > 0 ? 
            Math.round(reports.reduce((sum: number, r: any) => sum + (r.fuelPenalty || 0), 0) / reports.length) : 0;
          
          setStats({ totalReports, activeVessels, highPriority, avgFuelPenalty });
          setRecentReports(reports.slice(0, 3)); // Latest 3 reports
        }
      } catch (error) {
        console.error('🔥 Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const summaryCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports.toString(),
      change: '+12%',
      icon: <FiFileText className="w-6 h-6" />,
      color: 'blue',
    },
    {
      title: 'Active Vessels',
      value: stats.activeVessels.toString(),
      change: '+5%',
      icon: <FiActivity className="w-6 h-6" />,
      color: 'green',
    },
    {
      title: 'High Priority',
      value: stats.highPriority.toString(),
      change: stats.highPriority > 0 ? '+' + Math.round((stats.highPriority / stats.totalReports) * 100) + '%' : '0%',
      icon: <FiShield className="w-6 h-6" />,
      color: 'red',
    },
    {
      title: 'Avg Fuel Penalty',
      value: stats.avgFuelPenalty + '%',
      change: stats.avgFuelPenalty > 10 ? 'High' : 'Normal',
      icon: <FiUsers className="w-6 h-6" />,
      color: 'purple',
    },
  ];
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>;
  }
  
  return (
  <div className="bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your marine biofouling analysis operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                {card.icon}
              </div>
              <span className={`text-sm font-medium ${
                card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-gray-600 text-sm">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-lg ${getColorClasses(action.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/reports" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all reports →
          </Link>
        </div>
        <div className="space-y-4">
          {recentReports.length > 0 ? recentReports.map((report) => (
            <div key={report._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  report.criticality === 'High' ? 'bg-red-500' :
                  report.criticality === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{report.vessel}</p>
                  <p className="text-sm text-gray-600">{report.criticality} Priority</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(report.timestamp).toLocaleDateString()}
              </span>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>No reports yet. <Link to="/upload" className="text-blue-600 hover:underline">Create your first report</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
