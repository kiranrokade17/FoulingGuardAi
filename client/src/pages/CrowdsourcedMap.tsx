import React, { useState, useEffect } from 'react';
import { FiMap, FiMapPin, FiFilter, FiInfo, FiX } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HotspotData {
  id: string;
  lat: number;
  lng: number;
  severity: 'Low' | 'Medium' | 'High';
  count: number;
  location: string;
  lastReported: string;
  species?: string[];
}

const CrowdsourcedMap: React.FC = () => {
  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    const mapInstance = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);
    
    setMap(mapInstance);
    
    return () => {
      mapInstance.remove();
    };
  }, []);

  // Load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hotspots from database
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        console.log('🗺️ Fetching hotspots from:', `${apiUrl}/api/reports/hotspots`);
        
        const hotspotsResponse = await fetch(`${apiUrl}/api/reports/hotspots`);
        console.log('📡 Hotspots response status:', hotspotsResponse.status);
        
        if (hotspotsResponse.ok) {
          const hotspotsData = await hotspotsResponse.json();
          console.log('✅ Fetched hotspots from database:', hotspotsData.length, 'hotspots');
          console.log('📊 Sample hotspot:', hotspotsData[0]);
          
          setHotspots(hotspotsData.map((h: any) => ({
            id: `${h.lat},${h.lng}`,
            lat: h.lat,
            lng: h.lng,
            severity: h.severity,
            count: h.count,
            location: `${h.lat.toFixed(3)}, ${h.lng.toFixed(3)}`,
            lastReported: h.lastReported,
            species: h.species || []
          })));
        } else {
          const errorText = await hotspotsResponse.text();
          console.error('❌ Failed to fetch hotspots:', hotspotsResponse.status, errorText);
        }
      } catch (error) {
        console.error('🔥 Error fetching hotspots:', error);
      }
    };
    
    fetchData();
  }, []);

  // Update markers when hotspots or filter changes
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    
    // Add new markers
    const newMarkers: L.CircleMarker[] = [];
    const filteredHotspots = hotspots.filter(hotspot => 
      selectedSeverity === 'all' || hotspot.severity === selectedSeverity
    );
    
    filteredHotspots.forEach(hotspot => {
      const color = hotspot.severity === 'High' ? '#ef4444' : 
                   hotspot.severity === 'Medium' ? '#eab308' : '#22c55e';
      
      const size = hotspot.count >= 10 ? 20 : hotspot.count >= 5 ? 15 : 10;
      
      const marker = L.circleMarker([hotspot.lat, hotspot.lng], {
        radius: size,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      
      const speciesList = hotspot.species ? hotspot.species.join(', ') : 'Unknown';
      
      marker.bindPopup(`
        <div class="p-3">
          <h3 class="font-bold text-sm mb-1">${speciesList}</h3>
          <p class="text-xs text-gray-600 mb-1">Coordinates: ${hotspot.lat.toFixed(3)}, ${hotspot.lng.toFixed(3)}</p>
          <p class="text-xs text-gray-600 mb-1">${hotspot.count} report${hotspot.count > 1 ? 's' : ''}</p>
          <p class="text-xs text-gray-600 mb-1">Severity: <span class="font-medium">${hotspot.severity}</span></p>
          <p class="text-xs text-gray-500">Last: ${new Date(hotspot.lastReported).toLocaleDateString()}</p>
        </div>
      `);
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);
  }, [map, hotspots, selectedSeverity]);





  return (
    <div className="h-screen relative">
      {/* Full-screen Map */}
      <div id="map" className="w-full h-full"></div>
      
      {/* Floating Controls */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FiMap className="text-blue-600" />
              Biofouling Intelligence
            </h2>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {showSidebar ? <FiX /> : <FiFilter />}
            </button>
          </div>
          
          {/* Filters */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Filter by severity:</p>
            <div className="flex gap-1">
              {['all', 'High', 'Medium', 'Low'].map(severity => (
                <button
                  key={severity}
                  onClick={() => setSelectedSeverity(severity)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedSeverity === severity
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {severity === 'all' ? 'All' : severity}
                </button>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Legend:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>High Severity</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Medium Severity</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Low Severity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      {showSidebar && (
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              Active Hotspots ({hotspots.filter(h => selectedSeverity === 'all' || h.severity === selectedSeverity).length})
            </h3>
            <div className="space-y-2">
              {hotspots
                .filter(h => selectedSeverity === 'all' || h.severity === selectedSeverity)
                .map(hotspot => (
                <div key={hotspot.id} className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => map?.setView([hotspot.lat, hotspot.lng], 8)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{hotspot.location}</p>
                      <p className="text-xs text-gray-500">
                        {hotspot.count} report{hotspot.count > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      hotspot.severity === 'High' ? 'bg-red-500' :
                      hotspot.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                </div>
              ))}
              {hotspots.filter(h => selectedSeverity === 'all' || h.severity === selectedSeverity).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <FiInfo className="text-xl mx-auto mb-1" />
                  <p className="text-sm">No hotspots found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrowdsourcedMap;