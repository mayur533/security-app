'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSearch } from '@/lib/contexts/search-context';
import { CardLoading, TableLoading } from '@/components/ui/content-loading';
import { notificationsService, type Notification } from '@/lib/services/notifications';

const getStatusBadge = (notificationType: 'NORMAL' | 'EMERGENCY') => {
  if (notificationType === 'EMERGENCY') {
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
        Emergency
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200">
      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
      Normal
    </Badge>
  );
};

type SortField = 'created_at' | 'title' | 'notification_type';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'NORMAL' | 'EMERGENCY' | 'sent' | 'unsent';

export function NotificationsContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const { searchQuery } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showPaginationMenu, setShowPaginationMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by type and sent status
  let filteredNotifications = notifications;
  
  if (filter === 'sent') {
    filteredNotifications = filteredNotifications.filter(n => n.is_sent);
  } else if (filter === 'unsent') {
    filteredNotifications = filteredNotifications.filter(n => !n.is_sent);
  } else if (filter === 'NORMAL' || filter === 'EMERGENCY') {
    filteredNotifications = filteredNotifications.filter(n => n.notification_type === filter);
  }

  // Filter by search query
  if (searchQuery) {
    filteredNotifications = filteredNotifications.filter(
      (notif) =>
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  filteredNotifications = [...filteredNotifications].sort((a, b) => {
    let aValue: any = a[sortField as keyof Notification];
    let bValue: any = b[sortField as keyof Notification];

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

  const unsentCount = notifications.filter(n => !n.is_sent).length;
  const emergencyCount = notifications.filter(n => n.notification_type === 'EMERGENCY').length;

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
          <p className="text-sm text-muted-foreground">
            {notifications.length} total • {emergencyCount} emergency • {unsentCount} unsent
          </p>
        </div>
      </div>

      {/* Pagination, Filter, and Sort Controls */}
      <div className="flex items-center justify-end gap-3 mb-6">

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
                    setFilter('sent');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filter === 'sent'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Sent Only
                </button>
                <button
                  onClick={() => {
                    setFilter('unsent');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filter === 'unsent'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Unsent Only
                </button>

                <div className="border-t border-border my-2"></div>

                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Filter by Type
                </div>
                <button
                  onClick={() => {
                    setFilter('NORMAL');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    filter === 'NORMAL'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Normal
                </button>
                <button
                  onClick={() => {
                    setFilter('EMERGENCY');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    filter === 'EMERGENCY'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Emergency
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
                {[
                  { value: 'created_at' as SortField, label: 'Date Created' },
                  { value: 'title' as SortField, label: 'Title' },
                  { value: 'notification_type' as SortField, label: 'Type' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortField(option.value);
                      setCurrentPage(1);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      sortField === option.value
                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {option.label}
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
              <TableHead className="text-muted-foreground text-sm font-medium">Geofence</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Organization</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground text-sm font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNotifications.map((notification) => (
              <TableRow
                key={notification.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <TableCell className="py-4 px-4">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">By: {notification.created_by_username || 'System'}</div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="text-sm max-w-xs truncate">{notification.message}</div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="text-sm flex items-center gap-1">
                    <span className="material-icons text-xs text-indigo-600">location_on</span>
                    {notification.target_geofence_name || 'All'}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="text-sm flex items-center gap-1">
                    <span className="material-icons text-xs text-indigo-600">business</span>
                    {notification.organization_name || '-'}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  {getStatusBadge(notification.notification_type)}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Badge variant={notification.is_sent ? "default" : "outline"}>
                    {notification.is_sent ? 'Sent' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <span className="material-icons text-lg">more_vert</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <span className="material-icons text-sm mr-2">visibility</span>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <span className="material-icons text-sm mr-2">delete</span>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
