import { create } from 'zustand';

export interface DashboardStats {
  totalSubAdmins: number;
  activeGeofences: number;
  activeUsers: number;
  totalAlerts: number;
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
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
