'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { organizationsService, Organization, OrganizationCreateData } from '@/lib/services/organizations';
import { ContentLoading, CardLoading } from '@/components/ui/content-loading';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewDetailsOrg, setViewDetailsOrg] = useState<Organization | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deleteOrgId, setDeleteOrgId] = useState<number | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationsService.getAll();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    try {
      setSubmitting(true);
      await organizationsService.create(formData);
      toast.success('Organization created successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchOrganizations();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingOrg || !formData.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    try {
      setSubmitting(true);
      await organizationsService.update(editingOrg.id, formData);
      toast.success('Organization updated successfully');
      setIsEditModalOpen(false);
      setEditingOrg(null);
      setFormData({ name: '', description: '' });
      fetchOrganizations();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteOrgId) return;

    try {
      await organizationsService.delete(deleteOrgId);
      toast.success('Organization deleted successfully');
      setDeleteOrgId(null);
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Failed to delete organization');
    }
  };

  const openEditModal = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      description: org.description || '',
    });
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter and sort
  let filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort
  filteredOrgs = [...filteredOrgs].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrgs = filteredOrgs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Organizations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage security organizations and divisions
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData({ name: '', description: '' });
            setIsAddModalOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <span className="material-icons text-sm mr-2">add</span>
          Add Organization
        </Button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <CardLoading count={3} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{organizations.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                <span className="material-icons text-white text-2xl">business</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active This Month</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                  {organizations.filter(org => {
                    const createdDate = new Date(org.created_at);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
                <span className="material-icons text-white text-2xl">trending_up</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recently Added</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">
                  {organizations.filter(org => {
                    const createdDate = new Date(org.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return createdDate >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
                <span className="material-icons text-white text-2xl">schedule</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Table Card */}
      <Card className="p-6">
        {loading ? (
          <ContentLoading />
        ) : (
          <>
            {/* Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                    search
                  </span>
                  <Input
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <span className="material-icons text-sm mr-2">sort</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="25">25 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                    <SelectItem value="100">100 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-4 px-4">Organization Name</TableHead>
                    <TableHead className="py-4 px-4">Description</TableHead>
                    <TableHead className="py-4 px-4">Created Date</TableHead>
                    <TableHead className="py-4 px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrgs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-icons text-4xl">business</span>
                          <p>No organizations found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrgs.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-sm text-indigo-600">business</span>
                            <span className="font-medium">{org.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {org.description || 'No description'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <div className="text-sm">{formatDate(org.created_at)}</div>
                        </TableCell>
                        <TableCell className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="material-icons text-lg">more_vert</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewDetailsOrg(org)}>
                                <span className="material-icons text-sm mr-2">visibility</span>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(org)}>
                                <span className="material-icons text-sm mr-2">edit</span>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteOrgId(org.id)}
                                className="text-red-600"
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrgs.length)} of{' '}
                {filteredOrgs.length} organizations
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="material-icons text-sm">chevron_left</span>
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="material-icons text-sm">chevron_right</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Add Organization Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add New Organization
            </DialogTitle>
            <DialogDescription>
              Create a new security organization or division
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Downtown Security Division"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the organization..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setFormData({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={submitting || !formData.name.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {submitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Organization
            </DialogTitle>
            <DialogDescription>
              Update organization information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Organization Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Downtown Security Division"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the organization..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingOrg(null);
                setFormData({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={submitting || !formData.name.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {submitting ? 'Updating...' : 'Update Organization'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      {viewDetailsOrg && (
        <Dialog open={!!viewDetailsOrg} onOpenChange={() => setViewDetailsOrg(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Organization Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Organization Name</Label>
                <p className="text-base font-semibold">{viewDetailsOrg.name}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {viewDetailsOrg.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">{formatDate(viewDetailsOrg.created_at)}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">{formatDate(viewDetailsOrg.updated_at)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Organization ID</Label>
                <Badge variant="outline" className="font-mono">
                  ORG-{viewDetailsOrg.id}
                </Badge>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDetailsOrg(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewDetailsOrg(null);
                  openEditModal(viewDetailsOrg);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                <span className="material-icons text-sm mr-2" style={{ lineHeight: '0', verticalAlign: 'baseline', marginBottom: '-2px' }}>
                  edit
                </span>
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteOrgId} onOpenChange={() => setDeleteOrgId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this organization. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

