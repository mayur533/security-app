'use client';

import { useState, useEffect } from 'react';
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
import { useSearch } from '@/lib/contexts/search-context';
import { CardLoading, TableLoading } from '@/components/ui/content-loading';

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

type SortField = 'time' | 'title' | 'type';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'unread' | 'info' | 'warning' | 'success' | 'error';

export function NotificationsContainer() {
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);
  const [filter, setFilter] = useState<FilterType>('all');
  const { searchQuery } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showPaginationMenu, setShowPaginationMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter by type and unread
  let filteredNotifications = notifications;
  
  if (filter === 'unread') {
    filteredNotifications = filteredNotifications.filter(n => n.unread);
  } else if (filter !== 'all') {
    filteredNotifications = filteredNotifications.filter(n => n.type === filter);
  }

  // Filter by search query
  if (searchQuery) {
    filteredNotifications = filteredNotifications.filter(
      (notif) =>
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (notif.location && notif.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort
  filteredNotifications = [...filteredNotifications].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  if (isLoading) {
    return (
      <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
        {/* Header Loading */}
        <div className="flex items-center justify-between mb-6 animate-pulse">
          <div>
            <div className="h-6 w-40 bg-muted rounded mb-2"></div>
            <div className="h-4 w-48 bg-muted/60 rounded"></div>
          </div>
        </div>

        {/* Controls Loading */}
        <div className="flex items-center justify-end gap-3 mb-6 animate-pulse">
          <div className="h-10 w-32 bg-muted rounded-lg"></div>
          <div className="h-10 w-24 bg-muted rounded-lg"></div>
          <div className="h-10 w-24 bg-muted rounded-lg"></div>
        </div>

        {/* Table Loading */}
        <TableLoading rows={itemsPerPage} columns={5} />

        {/* Pagination Info Loading */}
        <div className="mt-4 flex items-center justify-between animate-pulse">
          <div className="h-4 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">All Notifications</h3>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
        </div>
      </div>

      {/* Pagination, Filter, and Sort Controls */}
      <div className="flex items-center justify-end gap-3 mb-6">
        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <span className="material-icons text-lg">done_all</span>
            <span className="text-sm font-medium">Mark All Read</span>
          </button>
        )}

        {/* Pagination Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPaginationMenu(!showPaginationMenu);
              setShowFilterMenu(false);
              setShowSortMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <span className="material-icons text-lg">apps</span>
            <span className="text-sm font-medium">Pagination</span>
          </button>

          {/* Pagination Dropdown */}
          {showPaginationMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Items per page
                </div>
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setItemsPerPage(count);
                      setCurrentPage(1);
                      setShowPaginationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      itemsPerPage === count
                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {count} items
                  </button>
                ))}

                <div className="border-t border-border my-2"></div>

                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Navigation
                </div>
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                      setShowPaginationMenu(false);
                    }
                  }}
                  disabled={currentPage === 1}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="material-icons text-sm">chevron_left</span>
                  Previous Page
                </button>
                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                      setShowPaginationMenu(false);
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="material-icons text-sm">chevron_right</span>
                  Next Page
                </button>

                <div className="border-t border-border my-2"></div>

                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Go to page
                </div>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      setShowPaginationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                        : 'hover:bg-muted'
                    }`}
                  >
                    Page {page}
                  </button>
                ))}
                {totalPages > 10 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    Showing first 10 pages of {totalPages}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowPaginationMenu(false);
              setShowSortMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <span className="material-icons text-lg">filter_list</span>
            <span className="text-sm font-medium">Filter</span>
            {filter !== 'all' && (
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Show
                </div>
                <button
                  onClick={() => {
                    setFilter('all');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filter === 'all'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Notifications
                </button>
                <button
                  onClick={() => {
                    setFilter('unread');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filter === 'unread'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Unread Only
                </button>

                <div className="border-t border-border my-2"></div>

                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Filter by Type
                </div>
                <button
                  onClick={() => {
                    setFilter('info');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    filter === 'info'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Info
                </button>
                <button
                  onClick={() => {
                    setFilter('success');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    filter === 'success'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Success
                </button>
                <button
                  onClick={() => {
                    setFilter('warning');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    filter === 'warning'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Warning
                </button>
                <button
                  onClick={() => {
                    setFilter('error');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    filter === 'error'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Critical
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowPaginationMenu(false);
              setShowFilterMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <span className="material-icons text-lg">sort</span>
            <span className="text-sm font-medium">Sort</span>
          </button>

          {/* Sort Dropdown */}
          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Sort By
                </div>
                {(['time', 'title', 'type'] as SortField[]).map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      setSortField(field);
                      setCurrentPage(1);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      sortField === field
                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </button>
                ))}

                <div className="border-t border-border my-2"></div>

                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Order
                </div>
                <button
                  onClick={() => {
                    setSortOrder('asc');
                    setCurrentPage(1);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortOrder === 'asc'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Ascending (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortOrder('desc');
                    setCurrentPage(1);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortOrder === 'desc'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Descending (Z-A)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-muted-foreground text-sm font-medium">Title</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Message</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Location</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Time</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNotifications.map((notification) => (
              <TableRow
                key={notification.id}
                className={`border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <TableCell className="py-3 px-4">
                  <div className="font-medium text-sm">{notification.title}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-sm">{notification.message}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-sm">{notification.location || '-'}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-sm">{notification.time}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-sm">{getStatusBadge(notification.type)}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-sm">
                    {notification.unread ? (
                      <span className="font-medium text-blue-600">Unread</span>
                    ) : (
                      <span className="text-muted-foreground">Read</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredNotifications.length)} of {filteredNotifications.length} notifications
          {filter !== 'all' && (
            <span className="ml-2 text-indigo-600 font-medium">
              (Filtered: {filter})
            </span>
          )}
        </p>
        <p>
          Page {currentPage} of {totalPages} • Sorted by: {sortField} ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
        </p>
      </div>
    </div>
  );
}
