'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// Dynamic imports for Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Polygon = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polygon),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface GeofenceData {
  id: string;
  name: string;
  coordinates: [number, number][];
  color: string;
  alertCount: number;
  officerCount: number;
  status: 'active' | 'inactive';
}

const geofencesData: GeofenceData[] = [
  {
    id: '1',
    name: 'Downtown Area',
    coordinates: [
      [40.7128, -74.0060],
      [40.7148, -74.0040],
      [40.7138, -74.0020],
      [40.7118, -74.0040],
    ],
    color: '#6366f1',
    alertCount: 3,
    officerCount: 12,
    status: 'active',
  },
  {
    id: '2',
    name: 'University Campus',
    coordinates: [
      [51.5074, -0.1278],
      [51.5094, -0.1258],
      [51.5084, -0.1238],
      [51.5064, -0.1258],
    ],
    color: '#8b5cf6',
    alertCount: 1,
    officerCount: 8,
    status: 'active',
  },
  {
    id: '3',
    name: 'Shopping Mall',
    coordinates: [
      [35.6762, 139.6503],
      [35.6782, 139.6523],
      [35.6772, 139.6543],
      [35.6752, 139.6523],
    ],
    color: '#06b6d4',
    alertCount: 0,
    officerCount: 6,
    status: 'active',
  },
  {
    id: '4',
    name: 'Business District',
    coordinates: [
      [-33.8688, 151.2093],
      [-33.8668, 151.2113],
      [-33.8678, 151.2133],
      [-33.8698, 151.2113],
    ],
    color: '#10b981',
    alertCount: 2,
    officerCount: 15,
    status: 'active',
  },
  {
    id: '5',
    name: 'Residential Zone A',
    coordinates: [
      [25.2048, 55.2708],
      [25.2068, 55.2728],
      [25.2058, 55.2748],
      [25.2038, 55.2728],
    ],
    color: '#f59e0b',
    alertCount: 0,
    officerCount: 5,
    status: 'active',
  },
];

interface GeofencesMapProps {
  selectedGeofence: string | null;
  onSelectGeofence: (id: string | null) => void;
}

export function GeofencesMap({ selectedGeofence, onSelectGeofence }: GeofencesMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    setIsClient(true);
    
    // Detect application theme
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      setIsDarkMode(hasDarkClass);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      observer.disconnect();
      document.head.removeChild(link);
    };
  }, []);

  const selectedGeofenceData = geofencesData.find((g) => g.id === selectedGeofence);

  if (mapError) {
    return (
      <div className="bg-card/50 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8 h-[calc(100vh-400px)] flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons text-6xl text-red-500 mb-4">error_outline</span>
          <h3 className="text-xl font-semibold mb-2">Map Error</h3>
          <p className="text-muted-foreground">Failed to load map component</p>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="bg-card/50 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8 h-[calc(100vh-400px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card/50 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
    }`}>
      {/* Map Controls Header */}
      <div className={`px-3 py-1.5 ${
        isFullscreen 
          ? 'bg-transparent border-b-0 absolute top-0 right-0 z-[1000]' 
          : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-border/50'
      }`}>
        <div className={`flex items-center ${isFullscreen ? 'justify-end' : 'justify-between'}`}>
          {!isFullscreen && (
            <h3 className="font-medium text-xs flex items-center gap-1.5">
              <span className="material-icons text-indigo-600 text-base">map</span>
              Security Zones Map
              {selectedGeofenceData && (
                <span className="text-xs font-normal text-muted-foreground">
                  • {selectedGeofenceData.name}
                </span>
              )}
            </h3>
          )}
          
          <div className="flex items-center gap-1.5">
            {selectedGeofence && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSelectGeofence(null)}
                >
                  <span className="material-icons text-sm mr-1">close</span>
                  Clear Selection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <span className="material-icons text-sm mr-1">edit</span>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <span className="material-icons text-sm mr-1">delete</span>
                  Delete
                </Button>
              </>
            )}
            
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-muted rounded transition-colors flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <span className="material-icons text-base text-muted-foreground hover:text-foreground leading-none">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div 
        className="relative" 
        style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 400px)' }}
      >
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={3}
          style={{ height: '100%', width: '100%', backgroundColor: isDarkMode ? '#0f172a' : '#e5e7eb' }}
          className="z-0"
        >
          <TileLayer
            url={
              isDarkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Geofence Polygons */}
          {geofencesData.map((geofence) => (
            <Polygon
              key={geofence.id}
              positions={geofence.coordinates}
              pathOptions={{
                color: geofence.color,
                fillColor: geofence.color,
                fillOpacity: selectedGeofence === geofence.id ? 0.4 : 0.2,
                weight: selectedGeofence === geofence.id ? 4 : 2,
                className: 'geofence-polygon',
              }}
              eventHandlers={{
                click: () => onSelectGeofence(geofence.id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: geofence.color,
                        boxShadow: `0 0 8px ${geofence.color}`,
                      }}
                    ></div>
                    <h4 className="font-semibold">{geofence.name}</h4>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          geofence.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {geofence.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active Alerts:</span>
                      <span className="font-medium text-orange-600">{geofence.alertCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Officers:</span>
                      <span className="font-medium text-blue-600">{geofence.officerCount}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t flex gap-2">
                    <button className="flex-1 px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                      View Details
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs border border-border rounded hover:bg-muted">
                      Edit
                    </button>
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-lg rounded-lg shadow-xl border border-border/50 p-4 z-[1000]">
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-2">
            <span className="material-icons text-sm">palette</span>
            Geofence Legend
          </h4>
          <div className="space-y-2">
            {geofencesData.slice(0, 5).map((geo) => (
              <div key={geo.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: geo.color,
                    boxShadow: `0 0 8px ${geo.color}80`,
                  }}
                ></div>
                <span className="truncate max-w-[120px]">{geo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

