'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { date: 'Jan 1', SOS: 12, Emergency: 8, Community: 5 },
  { date: 'Jan 8', SOS: 19, Emergency: 12, Community: 7 },
  { date: 'Jan 15', SOS: 15, Emergency: 10, Community: 9 },
  { date: 'Jan 22', SOS: 22, Emergency: 15, Community: 11 },
  { date: 'Jan 29', SOS: 18, Emergency: 13, Community: 8 },
  { date: 'Feb 5', SOS: 25, Emergency: 18, Community: 12 },
  { date: 'Feb 12', SOS: 21, Emergency: 16, Community: 10 },
];

export function AlertTrendsChart() {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  return (
    <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Alert Trends</h3>
          <p className="text-xs text-muted-foreground mt-1">Weekly alert distribution over time</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              chartType === 'bar'
                ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Bar
          </button>
          <button 
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              chartType === 'line'
                ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Line
          </button>
        </div>
      </div>
      
      <div className="h-[435px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
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
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="SOS" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Emergency" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Community" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
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
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="SOS" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Emergency" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Community" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

