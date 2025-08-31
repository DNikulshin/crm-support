import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ticketsAPI, type Ticket } from '../services/api';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
  Paperclip,
  FileImage,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority: string }) => void;
  isLoading: boolean;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', priority: 'MEDIUM' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new support ticket.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter ticket title"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail"
              required
              className="resize-none"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              className="min-w-[120px]"
            >
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Tickets: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const limit = 10;

  // Fetch tickets
  const { data, isLoading, error } = useQuery({
    queryKey: ['tickets', currentPage, limit],
    queryFn: () => ticketsAPI.getAll(currentPage, limit),
  });

  // Create ticket mutation
  const createMutation = useMutation({
    mutationFn: ticketsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketStats'] });
      setIsCreateModalOpen(false);
      toast.success('Ticket created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    },
  });

  const tickets = data?.data?.tickets || [];
  const totalPages = data?.data?.totalPages || 1;
  const total = data?.data?.total || 0;

  // Filter tickets based on search term and filters
  const filteredTickets = tickets.filter((ticket: Ticket) => {
    const matchesSearch = !searchTerm || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'destructive';
      case 'IN_PROGRESS':
        return 'default';
      case 'RESOLVED':
        return 'default';
      case 'CLOSED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4" />;
      case 'RESOLVED':
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCreateTicket = (ticketData: { title: string; description: string; priority: string }) => {
    createMutation.mutate({
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Error Loading Tickets</h2>
        <p className="text-muted-foreground">Unable to load tickets. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground text-lg">Manage and track support tickets</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter || 'all-statuses'} onValueChange={(value) => setStatusFilter(value === 'all-statuses' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter || 'all-priorities'} onValueChange={(value) => setPriorityFilter(value === 'all-priorities' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-priorities">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="space-y-1">
              {/* Desktop Header - Hidden on mobile */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b font-medium text-sm text-muted-foreground">
                <div className="col-span-4">Ticket</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-2">Author</div>
                <div className="col-span-2">Info</div>
                <div className="col-span-1">Created</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {/* Ticket Items */}
              <div className="divide-y">
                {filteredTickets.map((ticket: Ticket) => (
                  <div key={ticket.id} className="hover:bg-accent/30 transition-colors">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden p-4 space-y-3">
                      {/* Title and Description */}
                      <div className="space-y-1">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="font-medium text-primary hover:text-primary/80 transition-colors block"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                      
                      {/* Status, Priority, and Date Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={getStatusBadgeVariant(ticket.status)} className="flex items-center">
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 text-xs">{ticket.status.replace('_', ' ')}</span>
                          </Badge>
                          <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {/* Author Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {ticket.author?.firstName?.[0]}{ticket.author?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {ticket.author?.firstName} {ticket.author?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{ticket.author?.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/tickets/${ticket.id}`} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      
                      {/* Indicators Row */}
                      <div className="flex items-center space-x-2 pt-1">
                        {/* Comments indicator */}
                        {ticket.comments && ticket.comments.length > 0 && (
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            title={`${ticket.comments.length} comment${ticket.comments.length > 1 ? 's' : ''}`}
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs font-medium">{ticket.comments.length}</span>
                          </Link>
                        )}
                        
                        {/* Photo attachments */}
                        {ticket.attachments && ticket.attachments.some(a => a.mimeType.startsWith('image/')) && (
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                            title={`${ticket.attachments.filter(a => a.mimeType.startsWith('image/')).length} photo${ticket.attachments.filter(a => a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                          >
                            <FileImage className="h-3 w-3" />
                            <span className="text-xs font-medium">{ticket.attachments.filter(a => a.mimeType.startsWith('image/')).length}</span>
                          </Link>
                        )}
                        
                        {/* File attachments */}
                        {ticket.attachments && ticket.attachments.some(a => !a.mimeType.startsWith('image/')) && (
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                            title={`${ticket.attachments.filter(a => !a.mimeType.startsWith('image/')).length} file${ticket.attachments.filter(a => !a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                          >
                            <Paperclip className="h-3 w-3" />
                            <span className="text-xs font-medium">{ticket.attachments.filter(a => !a.mimeType.startsWith('image/')).length}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Desktop/Tablet Layout */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
                      {/* Ticket Title & Description */}
                      <div className="col-span-4 min-w-0">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="font-medium text-primary hover:text-primary/80 transition-colors block truncate"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {ticket.description}
                        </p>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-1">
                        <Badge variant={getStatusBadgeVariant(ticket.status)} className="flex items-center w-fit">
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 text-xs">{ticket.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      
                      {/* Priority */}
                      <div className="col-span-1">
                        <span className={`font-medium text-sm ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      {/* Author */}
                      <div className="col-span-2 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {ticket.author?.firstName?.[0]}{ticket.author?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {ticket.author?.firstName} {ticket.author?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{ticket.author?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info Indicators */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          {/* Comments indicator */}
                          {ticket.comments && ticket.comments.length > 0 && (
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                              title={`${ticket.comments.length} comment${ticket.comments.length > 1 ? 's' : ''}`}
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span className="text-xs font-medium">{ticket.comments.length}</span>
                            </Link>
                          )}
                          
                          {/* Photo attachments */}
                          {ticket.attachments && ticket.attachments.some(a => a.mimeType.startsWith('image/')) && (
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                              title={`${ticket.attachments.filter(a => a.mimeType.startsWith('image/')).length} photo${ticket.attachments.filter(a => a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                            >
                              <FileImage className="h-3 w-3" />
                              <span className="text-xs font-medium">{ticket.attachments.filter(a => a.mimeType.startsWith('image/')).length}</span>
                            </Link>
                          )}
                          
                          {/* File attachments */}
                          {ticket.attachments && ticket.attachments.some(a => !a.mimeType.startsWith('image/')) && (
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                              title={`${ticket.attachments.filter(a => !a.mimeType.startsWith('image/')).length} file${ticket.attachments.filter(a => !a.mimeType.startsWith('image/')).length > 1 ? 's' : ''}`}
                            >
                              <Paperclip className="h-3 w-3" />
                              <span className="text-xs font-medium">{ticket.attachments.filter(a => !a.mimeType.startsWith('image/')).length}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {/* Created Date */}
                      <div className="col-span-1">
                        <span className="text-sm text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/tickets/${ticket.id}`} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No tickets found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchTerm || statusFilter || priorityFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating your first support ticket.'}
              </p>
              {!searchTerm && !statusFilter && !priorityFilter && (
                <div className="mt-6">
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} results
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};