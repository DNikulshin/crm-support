import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, type User } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';
import { 
  Plus, 
  Search, 
  Edit2, 
  UserX, 
  UserCheck,
  Shield,
  User as UserIcon,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password (min. 6 characters)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as 'ADMIN' | 'USER' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'USER' as 'ADMIN' | 'USER',
    isActive: user?.isActive ?? true,
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editFirstName">First Name *</Label>
              <Input
                id="editFirstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLastName">Last Name *</Label>
              <Input
                id="editLastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="editEmail">Email *</Label>
            <Input
              id="editEmail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as 'ADMIN' | 'USER' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Update User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Check if current user is admin
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Shield className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  // Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll(),
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: usersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
      toast.success('Success', 'User created successfully!');
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success('Success', 'User updated successfully!');
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to update user');
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: usersAPI.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Success', 'User deactivated successfully!');
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to deactivate user');
    },
  });

  const users = data?.data || [];

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (userData: any) => {
    createMutation.mutate(userData);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (userData: any) => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: userData });
    }
  };

  const handleToggleUserStatus = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('Error', 'You cannot deactivate your own account.');
      return;
    }
    
    if (user.isActive) {
      if (window.confirm(`Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`)) {
        deactivateMutation.mutate(user.id);
      }
    } else {
      updateMutation.mutate({ 
        id: user.id, 
        data: { isActive: true }
      });
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <UserIcon className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
        <p className="text-gray-600">Unable to load users. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  className="pl-10"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="roleFilter">Role</Label>
              <Select value={roleFilter || 'all-roles'} onValueChange={(value) => setRoleFilter(value === 'all-roles' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-roles">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter || 'all-statuses'} onValueChange={(value) => setStatusFilter(value === 'all-statuses' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-4">
                            <span className="text-primary-foreground font-medium text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                              {user.id === currentUser?.id && (
                                <span className="ml-2 text-xs text-primary">(You)</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user)}
                      
                              disabled={deactivateMutation.isPending}
                              title={user.isActive ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.isActive ?  <UserCheck className='text-green-600' /> : <UserX  className='text-red-600'/>  }
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>   
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || roleFilter || statusFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating your first user.'}
              </p>
              {!searchTerm && !roleFilter && !statusFilter && (
                <div className="mt-6">
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={createMutation.isPending}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleUpdateUser}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};