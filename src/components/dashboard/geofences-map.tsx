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

  useEffect(() => {
    setIsClient(true);
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
    <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md border">
      <h3 className="font-semibold mb-4 text-lg">Geofences Overview</h3>
      <div className="relative h-96 rounded-md overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
