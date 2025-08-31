import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';
import { 
  User as UserIcon,
  Edit2,
  Save,
  X,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  Key
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
import { Card, CardContent, CardHeader } from '../components/ui/card';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; email: string }) => void;
  isLoading: boolean;
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
  });

  React.useEffect(() => {
    setFormData({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
    });
  }, [initialData]);

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
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information.
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
              required
            />
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
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: { firstName: string; lastName: string; email: string }) => 
      usersAPI.update(user!.id, data),
    onSuccess: (response) => {
      // Update the user data in local storage and context
      const updatedUser = { ...user!, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      setIsEditModalOpen(false);
      toast.success('Success', 'Profile updated successfully!');
      
      // If email changed, user might need to re-authenticate
      if (response.data.email !== user?.email) {
        toast.info('Email Updated', 'Your email has been updated. You may need to log in again.');
      }
    },
    onError: (error: any) => {
      toast.error('Error', error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleUpdateProfile = (formData: { firstName: string; lastName: string; email: string }) => {
    updateMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <UserIcon className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No User Data</h2>
        <p className="text-gray-600">Unable to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="text-center p-6">
              {/* Avatar */}
              <div className="mx-auto h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              
              {/* Name and Role */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center justify-center mb-4">
                <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'} flex items-center`}>
                  {user.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                  {user.role}
                </span>
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-center">
                <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'} flex items-center`}>
                  <UserCheck className="h-3 w-3 mr-1" />
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>First Name</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.firstName}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Last Name</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.lastName}</span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>User ID</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Key className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900 font-mono text-sm">{user.id}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Account Role</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Shield className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.role}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Account Status</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <UserCheck className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Member Since</Label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Update Profile Information</h4>
                    <p className="text-sm text-gray-500">Change your name and email address</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Sign Out</h4>
                    <p className="text-sm text-gray-500">Sign out of your account on this device</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to sign out?')) {
                        logout();
                      }
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
        isLoading={updateMutation.isPending}
        initialData={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }}
      />
    </div>
  );
};