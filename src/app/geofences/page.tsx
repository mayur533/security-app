'use client';

import { useState } from 'react';
import { GeofencesMap } from '@/components/geofences/geofences-map';
import { GeofencesSidebar } from '@/components/geofences/geofences-sidebar';
import { GeofencesStats } from '@/components/geofences/geofences-stats';
import { CreateGeofenceModal } from '@/components/geofences/create-geofence-modal';
import { Button } from '@/components/ui/button';

export default function GeofencesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<string | null>(null);

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
      <GeofencesStats />

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

