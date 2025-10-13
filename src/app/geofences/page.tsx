'use client';

import { useState, useEffect } from 'react';
import { GeofencesMap } from '@/components/geofences/geofences-map';
import { GeofencesSidebar } from '@/components/geofences/geofences-sidebar';
import { GeofencesStats } from '@/components/geofences/geofences-stats';
import { CreateGeofenceModal } from '@/components/geofences/create-geofence-modal';
import { Button } from '@/components/ui/button';
import { ContentLoading } from '@/components/ui/content-loading';

export default function GeofencesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Geofence Overview</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor security zones</p>
          </div>
        </div>

        {/* Stats Loading */}
        <GeofencesStats isLoading={true} />

        {/* Map and Sidebar Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-card rounded-lg shadow-md border overflow-hidden" style={{ height: '600px' }}>
            <ContentLoading text="Loading map..." />
          </div>
          <div className="lg:col-span-1 bg-card rounded-lg shadow-md border p-4">
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-32 bg-muted rounded"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted/60 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geofence Overview</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor security zones</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="material-icons text-xl mr-2">add_location</span>
          Create Geofence
        </Button>
      </div>

      {/* Stats Cards */}
      <GeofencesStats isLoading={false} />

      {/* Map and Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map - 3/4 width */}
        <div className="lg:col-span-3">
          <GeofencesMap
            selectedGeofence={selectedGeofence}
            onSelectGeofence={setSelectedGeofence}
          />
        </div>

        {/* Sidebar - 1/4 width (Right side) */}
        <div className="lg:col-span-1">
          <GeofencesSidebar
            selectedGeofence={selectedGeofence}
            onSelectGeofence={setSelectedGeofence}
          />
        </div>
      </div>

      {/* Create Geofence Modal */}
      <CreateGeofenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

