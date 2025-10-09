'use client';

import { useDashboardStore } from '@/lib/stores/dashboard';

const stats = [
  {
    title: 'Total Sub-Admins',
    value: 'totalSubAdmins',
    change: '+3 new sub-admins',
    icon: 'supervisor_account',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'Active Geofences',
    value: 'activeGeofences',
    change: '12 new security zones',
    icon: 'public',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Active Users',
    value: 'activeUsers',
    change: 'Real-time monitoring',
    icon: 'people',
    gradient: 'from-green-500 to-teal-500',
    showIndicator: true,
  },
  {
    title: 'Security Alerts',
    value: 'totalAlerts',
    change: '8 critical incidents',
    icon: 'warning',
    gradient: 'from-red-500 to-pink-500',
  },
] as const;

export function StatsCards() {
  const { stats: dashboardStats } = useDashboardStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const value = dashboardStats[stat.value as keyof typeof dashboardStats];
        return (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-lg shadow-lg text-white`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{stat.title}</h3>
              <span className="material-icons-outlined bg-white/20 p-2 rounded-lg">
                {stat.icon}
              </span>
            </div>
            <div className="flex items-baseline mt-4">
              <p className="text-3xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {'showIndicator' in stat && stat.showIndicator && (
                <div className="w-3 h-3 bg-green-300 rounded-full ml-2 animate-pulse" />
              )}
            </div>
            <p className="text-sm opacity-80 mt-1">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
