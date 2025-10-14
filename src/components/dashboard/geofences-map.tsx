'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { geofencesService } from '@/lib/services/geofences';
import { toast } from 'sonner';

// Dynamically import MapContainer to avoid SSR issues
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

interface Geofence {
  id: number;
  name: string;
  polygon_json: any;
  center_point?: any;
  active: boolean;
  organization_name?: string;
}

export function GeofencesMap() {
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchGeofences();
    
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

  const fetchGeofences = async () => {
    try {
      setLoading(true);
      const data = await geofencesService.getAll();
      setGeofences(data.filter(g => g.active)); // Only show active geofences
    } catch (error) {
      console.error('Error fetching geofences:', error);
      toast.error('Failed to fetch geofences');
    } finally {
      setLoading(false);
    }
  };

  // Extract coordinates from polygon_json
  const getPolygonCoordinates = (polygonJson: any): [number, number][] => {
    try {
      if (Array.isArray(polygonJson)) {
        return polygonJson.map((point: any) => [point.lat || point.latitude, point.lng || point.longitude]);
      }
      if (polygonJson.coordinates && Array.isArray(polygonJson.coordinates)) {
        return polygonJson.coordinates.map((point: any) => [point.lat || point.latitude, point.lng || point.longitude]);
      }
      return [];
    } catch (error) {
      console.error('Error parsing polygon coordinates:', error);
      return [];
    }
  };

  // Calculate map center from geofences
  const getMapCenter = (): [number, number] => {
    if (geofences.length === 0) return [20, 0];
    
    try {
      // Use center_point if available
      if (geofences[0].center_point?.lat && geofences[0].center_point?.lng) {
        return [geofences[0].center_point.lat, geofences[0].center_point.lng];
      }
      
      // Calculate from first geofence polygon
      const coords = getPolygonCoordinates(geofences[0].polygon_json);
      if (coords.length > 0) {
        const avgLat = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
        const avgLng = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
        if (!isNaN(avgLat) && !isNaN(avgLng)) {
          return [avgLat, avgLng];
        }
      }
    } catch (error) {
      console.error('Error calculating map center:', error);
    }
    
    return [20, 0];
  };

  const mapCenter = loading ? [20, 0] as [number, number] : getMapCenter();

  // Assign colors to geofences
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  const geofencesWithColors = geofences.map((geo, index) => ({
    ...geo,
    color: colors[index % colors.length],
  }));

  if (!isClient) {
    return (
      <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md border">
        <h3 className="font-semibold mb-4 text-lg">Geofences Overview</h3>
        <div className="relative h-96 bg-muted rounded-md overflow-hidden flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
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
        {loading ? (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-muted-foreground animate-pulse">Loading geofences...</div>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={geofences.length > 0 ? 12 : 2}
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
            {geofencesWithColors.map((geofence) => {
              const coordinates = getPolygonCoordinates(geofence.polygon_json);
              if (coordinates.length === 0) return null;

              return (
                <Polygon
                  key={geofence.id}
                  positions={coordinates}
                  pathOptions={{
                    color: geofence.color,
                    fillColor: geofence.color,
                    fillOpacity: 0.3,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold text-sm">{geofence.name}</p>
                      {geofence.organization_name && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {geofence.organization_name}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: geofence.color }}></span>
                        <span className="text-xs">Active Zone</span>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
