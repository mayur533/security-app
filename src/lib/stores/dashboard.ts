import { create } from 'zustand';
import { API_ENDPOINTS, getAuthHeaders } from '@/lib/config/api';

export interface DashboardStats {
  totalSubAdmins: number;
  activeGeofences: number;
  activeUsers: number;
  totalAlerts: number;
}

export interface DashboardKPIResponse {
  active_geofences: number;
  alerts_today: number;
  active_sub_admins: number;
  total_users: number;
  critical_alerts: number;
  system_health: string;
}

export interface Alert {
  id: string;
  time: string;
  location: string;
  type: string;
  status: 'pending' | 'critical' | 'resolved';
}

interface DashboardStore {
  stats: DashboardStats;
  alerts: Alert[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: {
    totalSubAdmins: 28,
    activeGeofences: 156,
    activeUsers: 1247,
    totalAlerts: 89,
  },
  alerts: [
    {
      id: '1',
      time: '2024-07-21 14:32',
      location: 'Downtown Area',
      type: 'SOS Alert',
      status: 'pending',
    },
    {
      id: '2',
      time: '2024-07-21 14:28',
      location: 'University Campus',
      type: 'Emergency Notification',
      status: 'critical',
    },
    {
      id: '3',
      time: '2024-07-21 14:15',
      location: 'Shopping Mall',
      type: 'Community Alert',
      status: 'resolved',
    },
  ],
  isLoading: false,
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(API_ENDPOINTS.DASHBOARD.KPIS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data: DashboardKPIResponse = await response.json();
        
        set({
          stats: {
            totalSubAdmins: data.active_sub_admins || 0,
            activeGeofences: data.active_geofences || 0,
            activeUsers: data.total_users || 0,
            totalAlerts: data.alerts_today || 0,
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlerts: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ isLoading: false });
  },
  updateAlertStatus: (id: string, status: Alert['status']) => {
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === id ? { ...alert, status } : alert
      ),
    }));
  },
}));
