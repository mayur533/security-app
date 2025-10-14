'use client';

import { useState, useEffect } from 'react';
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
import { ContentLoading, CardLoading, TableLoading } from '@/components/ui/content-loading';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Sort
  let sortedOrgs = [...organizations].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedOrgs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrgs = sortedOrgs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage security organizations and divisions</p>
        </div>
        <Button
          onClick={() => {
            setFormData({ name: '', description: '' });
            setIsAddModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="material-icons text-xl mr-2">add</span>
          Add Organization
        </Button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <CardLoading count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-100">Total Organizations</p>
                <h3 className="text-2xl font-bold mt-1">{organizations.length}</h3>
              </div>
              <span className="material-icons-outlined opacity-80" style={{ fontSize: '36px' }}>
                business
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100">Active This Month</p>
                <h3 className="text-2xl font-bold mt-1">
                  {organizations.filter(org => {
                    const createdDate = new Date(org.created_at);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                  }).length}
                </h3>
              </div>
              <span className="material-icons-outlined opacity-80" style={{ fontSize: '36px' }}>
                trending_up
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Recently Added</p>
                <h3 className="text-2xl font-bold mt-1">
                  {organizations.filter(org => {
                    const createdDate = new Date(org.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return createdDate >= weekAgo;
                  }).length}
                </h3>
              </div>
              <span className="material-icons-outlined opacity-80" style={{ fontSize: '36px' }}>
                schedule
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Table Card */}
      {loading ? (
        <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
          {/* Controls Loading */}
          <div className="flex items-center justify-end gap-3 mb-6 animate-pulse">
            <div className="h-10 w-32 bg-muted rounded-lg"></div>
            <div className="h-10 w-24 bg-muted rounded-lg"></div>
          </div>

          {/* Table Loading */}
          <TableLoading rows={itemsPerPage} columns={4} />

          {/* Pagination Info Loading */}
          <div className="mt-4 flex items-center justify-between animate-pulse">
            <div className="h-4 w-48 bg-muted rounded"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border/50">
          <>
            {/* Controls - Right Aligned */}
            <div className="flex items-center justify-end gap-3 mb-6">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <span className="material-icons text-sm mr-2">sort</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {/* Pagination Dropdown */}
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[130px]">
                  <span className="material-icons text-sm mr-2">apps</span>
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

            {/* Pagination Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedOrgs.length)} of{' '}
                {sortedOrgs.length} organizations
              </span>
              <span>Page {currentPage} of {totalPages || 1}</span>
            </div>
          </>
        </div>
      )}

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

