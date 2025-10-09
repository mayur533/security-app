'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useSearch } from '@/lib/contexts/search-context';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sub-Admin' | 'Security' | 'Resident';
  status: 'active' | 'inactive';
  lastLogin: string;
  assignedGeofence?: string;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@safefleet.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-02-15 10:30',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@safefleet.com',
    role: 'Sub-Admin',
    status: 'active',
    lastLogin: '2024-02-15 09:45',
    assignedGeofence: 'Downtown Area',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@safefleet.com',
    role: 'Security',
    status: 'active',
    lastLogin: '2024-02-15 11:20',
    assignedGeofence: 'University Campus',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@safefleet.com',
    role: 'Resident',
    status: 'active',
    lastLogin: '2024-02-14 18:30',
    assignedGeofence: 'Residential Zone A',
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david.park@safefleet.com',
    role: 'Security',
    status: 'inactive',
    lastLogin: '2024-02-10 14:00',
    assignedGeofence: 'Shopping Mall',
  },
  {
    id: '6',
    name: 'Jessica Williams',
    email: 'jessica.w@safefleet.com',
    role: 'Sub-Admin',
    status: 'active',
    lastLogin: '2024-02-15 08:15',
    assignedGeofence: 'Business District',
  },
  {
    id: '7',
    name: 'Robert Brown',
    email: 'robert.b@safefleet.com',
    role: 'Resident',
    status: 'active',
    lastLogin: '2024-02-15 07:30',
    assignedGeofence: 'Downtown Area',
  },
  {
    id: '8',
    name: 'Amanda Taylor',
    email: 'amanda.t@safefleet.com',
    role: 'Security',
    status: 'active',
    lastLogin: '2024-02-15 12:00',
    assignedGeofence: 'Industrial Park',
  },
  {
    id: '9',
    name: 'Christopher Lee',
    email: 'chris.lee@safefleet.com',
    role: 'Resident',
    status: 'active',
    lastLogin: '2024-02-15 06:45',
    assignedGeofence: 'Medical District',
  },
  {
    id: '10',
    name: 'Michelle Garcia',
    email: 'michelle.g@safefleet.com',
    role: 'Sub-Admin',
    status: 'active',
    lastLogin: '2024-02-15 13:15',
    assignedGeofence: 'Entertainment Zone',
  },
];

interface UsersTableProps {
  onEditUser: (userId: string) => void;
}

type SortField = 'name' | 'email' | 'role' | 'lastLogin';
type SortOrder = 'asc' | 'desc';
type FilterRole = 'all' | 'Admin' | 'Sub-Admin' | 'Security' | 'Resident';
type FilterStatus = 'all' | 'active' | 'inactive';

export function UsersTable({ onEditUser }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { searchQuery } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('lastLogin');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showPaginationMenu, setShowPaginationMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter by search
  let filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.assignedGeofence && user.assignedGeofence.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter by role
  if (filterRole !== 'all') {
    filteredUsers = filteredUsers.filter((user) => user.role === filterRole);
  }

  // Filter by status
  if (filterStatus !== 'all') {
    filteredUsers = filteredUsers.filter((user) => user.status === filterStatus);
  }

  // Sort
  filteredUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const badges = {
      Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'Sub-Admin': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
      Security: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      Resident: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badges[role]}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300">
        <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
        Inactive
      </span>
    );
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">people</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter((u) => u.status === 'active').length}
              </p>
            </div>
            <span className="material-icons text-4xl opacity-80">check_circle</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Security Officers</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter((u) => u.role === 'Security').length}
              </p>
            </div>
            <span className="material-icons text-4xl opacity-80">badge</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Residents</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter((u) => u.role === 'Resident').length}
              </p>
            </div>
            <span className="material-icons text-4xl opacity-80">home</span>
          </div>
        </div>
      </div>

      {/* Controls */}
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
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
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
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
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
            {(filterRole !== 'all' || filterStatus !== 'all') && (
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Filter by Role
                </div>
                <button
                  onClick={() => {
                    setFilterRole('all');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filterRole === 'all'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Roles
                </button>
                {['Admin', 'Sub-Admin', 'Security', 'Resident'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setFilterRole(role as FilterRole);
                      setCurrentPage(1);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filterRole === role
                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {role}
                  </button>
                ))}

                <div className="border-t border-border my-2"></div>

                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Filter by Status
                </div>
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('active');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Active Only
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('inactive');
                    setCurrentPage(1);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filterStatus === 'inactive'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-100'
                      : 'hover:bg-muted'
                  }`}
                >
                  Inactive Only
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

          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Sort By
                </div>
                {(['name', 'email', 'role', 'lastLogin'] as SortField[]).map((field) => (
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
                    {field === 'lastLogin' ? 'Last Login' : field.charAt(0).toUpperCase() + field.slice(1)}
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-muted-foreground text-sm font-semibold">Name</TableHead>
              <TableHead className="text-muted-foreground text-sm font-semibold">Role</TableHead>
              <TableHead className="text-muted-foreground text-sm font-semibold">Email</TableHead>
              <TableHead className="text-muted-foreground text-sm font-semibold">Status</TableHead>
              <TableHead className="text-muted-foreground text-sm font-semibold">Last Login</TableHead>
              <TableHead className="text-muted-foreground text-sm font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <span className="material-icons text-6xl text-muted-foreground mb-2">
                    search_off
                  </span>
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-b hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div className="font-medium text-sm">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell className="py-4 px-4">{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="text-sm">{user.lastLogin}</div>
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
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => onEditUser(user.id)}
                        >
                          <span className="material-icons text-sm mr-2">edit</span>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          <span className="material-icons text-sm mr-2">
                            {user.status === 'active' ? 'block' : 'check_circle'}
                          </span>
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <span className="material-icons text-sm mr-2">visibility</span>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          <span className="material-icons text-sm mr-2">delete</span>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          {(filterRole !== 'all' || filterStatus !== 'all') && (
            <span className="ml-2 text-indigo-600 font-medium">(Filtered)</span>
          )}
        </p>
        <p>
          Page {currentPage} of {totalPages} • Sorted by: {sortField} ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
        </p>
      </div>
    </div>
  );
}


