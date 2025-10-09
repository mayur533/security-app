import { StatsCards } from '@/components/dashboard/stats-cards';
import { GeofencesMap } from '@/components/dashboard/geofences-map';
import { DailyAlertsChart } from '@/components/dashboard/daily-alerts-chart';
import { UserActivityChart } from '@/components/dashboard/user-activity-chart';
import { RecentAlertsTable } from '@/components/dashboard/recent-alerts-table';
import { AlertControls } from '@/components/dashboard/alert-controls';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <AlertControls />
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeofencesMap />
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="font-semibold mb-4 text-lg">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Geofence created</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Security alert resolved</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="font-semibold mb-4 text-lg">Security Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Security Officers</span>
              <span className="text-lg font-semibold text-primary">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Communities</span>
              <span className="text-lg font-semibold text-primary">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="text-lg font-semibold text-green-600">2.4 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Premium Users</span>
              <span className="text-lg font-semibold text-blue-600">67%</span>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="font-semibold mb-4 text-lg">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Server Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Push Notifications</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">GPS Tracking</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyAlertsChart />
        <UserActivityChart />
      </div>
      
      <RecentAlertsTable />
    </div>
  );
}