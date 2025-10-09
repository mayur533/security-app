'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface GeofenceLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const geofenceLocations: GeofenceLocation[] = [
  { id: '1', name: 'University Campus', lat: 40.7128, lng: -74.0060 },
  { id: '2', name: 'Downtown Area', lat: 51.5074, lng: -0.1278 },
  { id: '3', name: 'Shopping Mall', lat: 35.6762, lng: 139.6503 },
  { id: '4', name: 'Business District', lat: -33.8688, lng: 151.2093 },
  { id: '5', name: 'Residential Zone', lat: 25.2048, lng: 55.2708 },
];

export function GeofencesMap() {
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isClient) {
    return (
      <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md border">
        <h3 className="font-semibold mb-4 text-lg">Security Zones Overview</h3>
        <div className="relative h-96 bg-muted rounded-md overflow-hidden flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md border">
        <h3 className="font-semibold mb-4 text-lg">Security Zones Overview</h3>
        <div className="relative h-96 bg-muted rounded-md overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeaqmcqa_yagXJNqVqXnysSnsK-NH5zvArOqbXoLJxp8ZoL5TKWGvuu0YzKEUbVyMn6hohwBXoV0LEnScnv8pYqnXJlege5ulWgdEXJq2vdxWIEB9QUOM-Sqa3BOo8ojMdfluo_iUAnLnW0XNlt4eoyf8z4EIUDjBAi4CEdihbNPornWEzJTzBrAG_BBnoWxXYgx59GFxWHblnoA6FQV4howFV2RJYvnIEJarck2_Kl2uwRqdsdB733OX3uVkySDXg-lfpi_PmAVj5"
              alt="World map with geofence markers"
              className="w-full h-full object-cover opacity-80"
            />
            {geofenceLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: `${20 + (index * 15)}%`,
                  left: `${25 + (index * 12)}%`,
                }}
              >
                <span className="material-icons text-primary" style={{ fontSize: '20px' }}>
                  location_on
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`lg:col-span-2 bg-card pt-2 pb-6 px-6 rounded-lg shadow-md border overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none p-0' : ''
    }`}>
      {/* Map Header - Compact */}
      <div className={`flex items-center justify-between mb-2 ${
        isFullscreen ? 'absolute top-2 left-2 right-2 z-[1000]' : ''
      }`}>
        {!isFullscreen && (
          <h3 className="font-semibold text-sm">Geofences Overview</h3>
        )}
        
        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={`p-1.5 transition-colors flex items-center justify-center ${
            isFullscreen 
              ? 'bg-card/80 backdrop-blur-sm hover:bg-card rounded-lg shadow-lg border border-border/50'
              : 'hover:bg-muted rounded'
          }`}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          <span className="material-icons text-base text-muted-foreground hover:text-foreground">
            {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>
      </div>
      
      <div 
        className={`relative overflow-hidden ${
          isFullscreen ? 'h-screen' : 'h-96 rounded-md'
        }`}
        style={isFullscreen ? { height: '100vh' } : {}}
      >
        <MapContainer
          center={[20, 0]}
          zoom={2}
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
          {geofenceLocations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]}>
              <Popup>
                <div className="text-center">
                  <span className="material-icons text-primary" style={{ fontSize: '20px' }}>
                    location_on
                  </span>
                  <p className="text-sm font-medium mt-1">{location.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
