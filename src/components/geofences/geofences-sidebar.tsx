'use client';

import { useState } from 'react';
import { useSearch } from '@/lib/contexts/search-context';

interface Geofence {
  id: string;
  name: string;
  area: string;
  status: 'active' | 'inactive';
  alertCount: number;
  officerCount: number;
  color: string;
}

const geofences: Geofence[] = [
  {
    id: '1',
    name: 'Downtown Area',
    area: 'Central District',
    status: 'active',
    alertCount: 3,
    officerCount: 12,
    color: '#6366f1',
  },
  {
    id: '2',
    name: 'University Campus',
    area: 'Education Zone',
    status: 'active',
    alertCount: 1,
    officerCount: 8,
    color: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Shopping Mall',
    area: 'Commercial Zone',
    status: 'active',
    alertCount: 0,
    officerCount: 6,
    color: '#06b6d4',
  },
  {
    id: '4',
    name: 'Business District',
    area: 'Financial Center',
    status: 'active',
    alertCount: 2,
    officerCount: 15,
    color: '#10b981',
  },
  {
    id: '5',
    name: 'Residential Zone A',
    area: 'North Residential',
    status: 'active',
    alertCount: 0,
    officerCount: 5,
    color: '#f59e0b',
  },
  {
    id: '6',
    name: 'Industrial Park',
    area: 'Industrial Zone',
    status: 'inactive',
    alertCount: 0,
    officerCount: 3,
    color: '#64748b',
  },
  {
    id: '7',
    name: 'Medical District',
    area: 'Healthcare Zone',
    status: 'active',
    alertCount: 1,
    officerCount: 10,
    color: '#ec4899',
  },
  {
    id: '8',
    name: 'Entertainment Zone',
    area: 'Nightlife District',
    status: 'active',
    alertCount: 4,
    officerCount: 18,
    color: '#f43f5e',
  },
];

interface GeofencesSidebarProps {
  selectedGeofence: string | null;
  onSelectGeofence: (id: string | null) => void;
}

export function GeofencesSidebar({ selectedGeofence, onSelectGeofence }: GeofencesSidebarProps) {
  const { searchQuery } = useSearch();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter geofences
  let filteredGeofences = geofences.filter((geo) =>
    geo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    geo.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterStatus !== 'all') {
    filteredGeofences = filteredGeofences.filter((geo) => geo.status === filterStatus);
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 400px)' }}>
      {/* Header */}
      <div className="px-4 py-2 border-b border-border/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="material-icons text-indigo-600 text-lg">location_city</span>
          Geofence List
        </h3>
      </div>

      {/* Filter Tabs */}
      <div className="p-2 border-b border-border/50">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-background hover:bg-muted'
            }`}
          >
            All ({geofences.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'active'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-background hover:bg-muted'
            }`}
          >
            Active ({geofences.filter((g) => g.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'inactive'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-background hover:bg-muted'
            }`}
          >
            Inactive ({geofences.filter((g) => g.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Geofence List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredGeofences.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-icons text-6xl text-muted-foreground mb-2">
              search_off
            </span>
            <p className="text-sm text-muted-foreground">No geofences found</p>
          </div>
        ) : (
          filteredGeofences.map((geo) => (
            <button
              key={geo.id}
              onClick={() => onSelectGeofence(selectedGeofence === geo.id ? null : geo.id)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                selectedGeofence === geo.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 shadow-lg'
                  : 'border-border/50 hover:border-indigo-300 hover:bg-muted/50'
              }`}
            >
              {/* Color indicator */}
              <div className="flex items-start gap-3">
                <div
                  className="w-4 h-4 rounded-full mt-1 shadow-lg"
                  style={{
                    backgroundColor: geo.color,
                    boxShadow: `0 0 12px ${geo.color}80`,
                  }}
                ></div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm truncate">{geo.name}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        geo.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {geo.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{geo.area}</p>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-sm text-orange-500">warning</span>
                      <span>{geo.alertCount} alerts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-sm text-blue-500">badge</span>
                      <span>{geo.officerCount} officers</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border/50 bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Showing {filteredGeofences.length} of {geofences.length} geofences
        </p>
      </div>
    </div>
  );
}

