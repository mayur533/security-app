'use client';

import { useState } from 'react';
import { useSearch } from '@/lib/contexts/search-context';
import { type Geofence } from '@/lib/services/geofences';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Color palette for geofences
const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f97316'];

interface GeofencesSidebarProps {
  selectedGeofence: number | null;
  onSelectGeofence: (id: number | null) => void;
  geofences: Geofence[];
  onRefresh: () => void;
}

export function GeofencesSidebar({ selectedGeofence, onSelectGeofence, geofences, onRefresh }: GeofencesSidebarProps) {
  const { searchQuery } = useSearch();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewDetailsGeofence, setViewDetailsGeofence] = useState<Geofence | null>(null);
  const [editGeofence, setEditGeofence] = useState<Geofence | null>(null);

  // Assign colors to geofences
  const geofencesWithColors = geofences.map((geo, idx) => ({
    ...geo,
    color: colors[idx % colors.length]
  }));

  // Filter geofences
  let filteredGeofences = geofencesWithColors.filter((geo) =>
    geo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (geo.description && geo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (geo.organization_name && geo.organization_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (filterStatus !== 'all') {
    filteredGeofences = filteredGeofences.filter((geo) => 
      geo.active === (filterStatus === 'active')
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-card/50 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 400px)' }}>
        {/* Header */}
        <div className="px-4 py-2 border-b border-border/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <span className="material-icons text-indigo-600 text-lg">location_city</span>
            Geofence List ({filteredGeofences.length})
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
              Active ({geofences.filter((g) => g.active).length})
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'inactive'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              Inactive ({geofences.filter((g) => !g.active).length})
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
              <div
                key={geo.id}
                onClick={() => onSelectGeofence(selectedGeofence === geo.id ? null : geo.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedGeofence === geo.id
                    ? 'bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 shadow-lg border-2'
                    : 'bg-background hover:bg-muted border border-border'
                }`}
                style={{
                  borderColor: selectedGeofence === geo.id ? geo.color : undefined,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: geo.color }}
                      />
                      <h4 className="font-medium text-sm">{geo.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {geo.organization_name || `Org #${geo.organization}`}
                    </p>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    geo.active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {geo.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewDetailsGeofence(geo);
                      }}
                      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      <span className="material-icons" style={{ fontSize: '14px' }}>visibility</span>
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditGeofence(geo);
                      }}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      <span className="material-icons" style={{ fontSize: '14px' }}>edit</span>
                      Edit
                    </button>
                  </div>
                  <span className="text-xs">{formatDate(geo.created_at).split(',')[0]}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewDetailsGeofence && (
        <Dialog open={!!viewDetailsGeofence} onOpenChange={() => setViewDetailsGeofence(null)}>
          <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-xl border-border/50 p-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                <span className="material-icons text-indigo-600 mr-2">
                  map
                </span>
                Geofence Details
              </DialogTitle>
              <DialogDescription>
                Complete information about this security zone
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-3">
              {/* Geofence Header */}
              <div className="space-y-2 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{viewDetailsGeofence.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    viewDetailsGeofence.active
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {viewDetailsGeofence.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {viewDetailsGeofence.description && (
                  <p className="text-sm text-muted-foreground">{viewDetailsGeofence.description}</p>
                )}
              </div>

              {/* Geofence Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Organization */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Organization</Label>
                  <p className="text-base font-medium flex items-center gap-1">
                    <span className="material-icons text-sm text-indigo-600">business</span>
                    {viewDetailsGeofence.organization_name || `Organization #${viewDetailsGeofence.organization}`}
                  </p>
                </div>

                {/* Created By */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                  <p className="text-base font-medium">{viewDetailsGeofence.created_by_username || 'System'}</p>
                </div>

                {/* Created At */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-base font-medium">{formatDate(viewDetailsGeofence.created_at)}</p>
                </div>

                {/* Updated At */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-base font-medium">{formatDate(viewDetailsGeofence.updated_at)}</p>
                </div>

                {/* Center Point */}
                {viewDetailsGeofence.center_point && (
                  <div className="space-y-1 col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Center Point</Label>
                    <p className="text-base font-mono text-xs">
                      Lat: {viewDetailsGeofence.center_point[0].toFixed(6)}, Lng: {viewDetailsGeofence.center_point[1].toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* Polygon Coordinates */}
              <div className="space-y-1 pt-2 border-t">
                <Label className="text-sm font-medium text-muted-foreground">Polygon Coordinates</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(() => {
                    try {
                      const polygonJson = viewDetailsGeofence.polygon_json as Record<string, unknown>;
                      if (polygonJson.type === 'Polygon' && Array.isArray(polygonJson.coordinates)) {
                        const coords = polygonJson.coordinates[0] as number[][];
                        return coords.slice(0, 4).map((coord, idx) => (
                          <div key={idx} className="bg-muted/30 p-2 rounded">
                            <Label className="text-xs text-muted-foreground">Point {idx + 1}</Label>
                            <p className="text-xs font-mono mt-1">
                              Lat: {coord[0].toFixed(6)}<br/>
                              Lng: {coord[1].toFixed(6)}
                            </p>
                          </div>
                        ));
                      }
                    } catch (e) {
                      return <p className="text-xs text-red-500">Invalid polygon data</p>;
                    }
                  })()}
                </div>
              </div>

              {/* Geofence ID */}
              <div className="space-y-1 pt-2 border-t">
                <Label className="text-sm font-medium text-muted-foreground">Geofence ID</Label>
                <p className="text-base font-mono text-sm">{viewDetailsGeofence.id}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t mt-3">
              <Button
                variant="outline"
                onClick={() => setViewDetailsGeofence(null)}
              >
                <span className="material-icons text-sm mr-2" style={{ lineHeight: '0', verticalAlign: 'baseline', marginBottom: '-2px' }}>close</span>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal - Info Only for Super Admin */}
      {editGeofence && (
        <Dialog open={!!editGeofence} onOpenChange={() => setEditGeofence(null)}>
          <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                <span className="material-icons text-indigo-600 mr-2">
                  info
                </span>
                View Only Access
              </DialogTitle>
              <DialogDescription>
                Geofence editing is restricted to Sub-Admins
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <div className="flex gap-3">
                  <span className="material-icons text-blue-600">lock</span>
                  <div>
                    <p className="text-sm font-medium mb-2">Super Admin Access Level</p>
                    <p className="text-xs text-muted-foreground">
                      As a Super Admin, you have <strong>view-only</strong> access to geofences across all organizations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 p-4 rounded-lg">
                <div className="flex gap-3">
                  <span className="material-icons text-indigo-600">edit_location</span>
                  <div>
                    <p className="text-sm font-medium mb-2">Who Can Edit Geofences?</p>
                    <p className="text-xs text-muted-foreground">
                      Only <strong>Sub-Admins</strong> can create, edit, and delete geofences within their assigned organizations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Geofence</Label>
                <div className="bg-muted/30 p-3 rounded">
                  <p className="font-medium">{editGeofence.name}</p>
                  <p className="text-xs text-muted-foreground">{editGeofence.organization_name}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
              <Button
                variant="outline"
                onClick={() => setEditGeofence(null)}
              >
                <span className="material-icons text-sm mr-2" style={{ lineHeight: '0', verticalAlign: 'baseline', marginBottom: '-2px' }}>close</span>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
