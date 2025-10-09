'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  unread: boolean;
  location?: string;
}

const allNotifications: Notification[] = [
  {
    id: '1',
    title: 'SOS Alert',
    message: 'Emergency alert triggered in University Campus',
    time: '2024-07-21 14:32',
    type: 'error',
    unread: true,
    location: 'University Campus',
  },
  {
    id: '2',
    title: 'User Registration',
    message: 'New user joined the security network',
    time: '2024-07-21 14:15',
    type: 'success',
    unread: true,
    location: 'Downtown Area',
  },
  {
    id: '3',
    title: 'Geofence Created',
    message: 'New security zone added to Downtown Area',
    time: '2024-07-21 13:45',
    type: 'info',
    unread: false,
    location: 'Downtown Area',
  },
  {
    id: '4',
    title: 'Security Alert Resolved',
    message: 'Previous emergency alert has been resolved',
    time: '2024-07-21 13:30',
    type: 'success',
    unread: false,
    location: 'Shopping Mall',
  },
  {
    id: '5',
    title: 'System Update',
    message: 'Security protocols updated successfully',
    time: '2024-07-21 12:00',
    type: 'info',
    unread: false,
  },
  {
    id: '6',
    title: 'Community Alert',
    message: 'Emergency notification sent to community members',
    time: '2024-07-21 11:30',
    type: 'warning',
    unread: false,
    location: 'Business District',
  },
  {
    id: '7',
    title: 'Sub-admin Added',
    message: 'New sub-admin assigned to manage security zones',
    time: '2024-07-21 10:15',
    type: 'info',
    unread: false,
  },
  {
    id: '8',
    title: 'Maintenance Complete',
    message: 'Scheduled system maintenance completed successfully',
    time: '2024-07-21 09:00',
    type: 'success',
    unread: false,
  },
];

const getStatusBadge = (type: Notification['type']) => {
  switch (type) {
    case 'error':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          Critical
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
          Warning
        </Badge>
      );
    case 'success':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
          Success
        </Badge>
      );
    case 'info':
    default:
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
          Info
        </Badge>
      );
  }
};

export function NotificationsContainer() {
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.unread)
    : notifications;

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">All Notifications</h3>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.map((notification) => (
              <TableRow
                key={notification.id}
                className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(notification.type)}
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{notification.title}</TableCell>
                <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                <TableCell>{notification.location || '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {notification.time}
                </TableCell>
                <TableCell>
                  {notification.unread ? (
                    <span className="text-sm font-medium text-blue-600">Unread</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Read</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
