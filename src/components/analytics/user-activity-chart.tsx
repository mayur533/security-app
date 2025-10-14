'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { usersService } from '@/lib/services/users';
import { toast } from 'sonner';

export function UserActivityChart() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch user activity');
    } finally {
      setLoading(false);
    }
  };

  // Process users data into daily registration activity
  const processUserActivity = () => {
    if (users.length === 0) return [];

    // Group users by day of week based on date_joined
    const weeklyData: { [key: string]: number } = {
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0,
      'Sun': 0,
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    users.forEach(user => {
      if (user.date_joined) {
        const date = new Date(user.date_joined);
        const dayName = dayNames[date.getDay()];
        weeklyData[dayName] = (weeklyData[dayName] || 0) + 1;
      }
    });

    // Convert to array in week order
    const weekOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekOrder.map(day => ({
      day,
      users: weeklyData[day],
    }));
  };

  const data = processUserActivity();

  if (loading) {
    return (
      <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
        <div className="mb-6">
          <h3 className="font-semibold text-lg">User Registrations</h3>
          <p className="text-xs text-muted-foreground mt-1">Loading...</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0 || data.every(d => d.users === 0)) {
    return (
      <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
        <div className="mb-6">
          <h3 className="font-semibold text-lg">User Registrations</h3>
          <p className="text-xs text-muted-foreground mt-1">Weekly registration activity</p>
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
          <span className="material-icons text-6xl mb-4">person_add</span>
          <p>No user registration data available</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">User Registrations (Weekly)</h3>
        <p className="text-xs text-muted-foreground mt-1">New user signups by day of week - Real data from API</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




