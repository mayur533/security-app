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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <GeofencesMap />
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="font-semibold mb-4 text-lg">Security Overview</h3>
          <div className="space-y-3">
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Alerts</span>
              <span className="text-lg font-semibold text-orange-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved Today</span>
              <span className="text-lg font-semibold text-green-600">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total SOS Calls</span>
              <span className="text-lg font-semibold text-red-600">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Coverage Areas</span>
              <span className="text-lg font-semibold text-purple-600">28</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Online Officers</span>
              <span className="text-lg font-semibold text-cyan-600">76</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Resolution</span>
              <span className="text-lg font-semibold text-teal-600">8.5 min</span>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md border flex flex-col">
          <h3 className="font-semibold mb-4 text-lg">Recent Activity</h3>
          <div className="space-y-3 overflow-y-auto max-h-96 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Geofence created</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Security alert resolved</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">SOS alert triggered</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sub-admin assigned</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Community message sent</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Emergency notification</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Security officer joined</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
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