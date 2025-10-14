'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'SOS Alerts', value: 345, color: '#ef4444' },
  { name: 'Emergency', value: 278, color: '#f59e0b' },
  { name: 'Community', value: 189, color: '#3b82f6' },
  { name: 'Geofence', value: 156, color: '#10b981' },
  { name: 'System', value: 89, color: '#8b5cf6' },
];

export function AlertTypesChart() {
  return (
    <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Alert Types Distribution</h3>
        <p className="text-xs text-muted-foreground mt-1">Breakdown by category</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
        {data.slice(0, 4).map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




