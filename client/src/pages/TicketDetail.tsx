import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI, usersAPI, type Ticket, type Comment, type User } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Edit2,
  MessageSquare,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  Send,
  Eye,
  EyeOff,
  Loader2,
  User as UserIcon
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
import { CommentActions } from '../components/CommentActions';
import { AttachmentManager } from '../components/AttachmentManager';

interface UpdateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  users: User[];
}

const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  ticket, 
  onSubmit, 
  isLoading, 
  users 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: ticket?.title || '',
    description: ticket?.description || '',
    status: ticket?.status || 'OPEN',
    priority: ticket?.priority || 'MEDIUM',
    assigneeId: ticket?.assigneeId || 'unassigned',
  });

  React.useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigneeId: ticket.assigneeId || 'unassigned',
      });
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    // Convert 'unassigned' back to null for API
    const submitData = {
      ...formData,
      assigneeId: formData.assigneeId === 'unassigned' ? null : formData.assigneeId
    };
    onSubmit(submitData);
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Update Ticket</DialogTitle>
          <DialogDescription>
            Make changes to the ticket details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={user?.role !== 'ADMIN' && ticket.authorId !== user?.id}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={user?.role !== 'ADMIN' && ticket.authorId !== user?.id}
              className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                disabled={user?.role !== 'ADMIN'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                disabled={user?.role !== 'ADMIN'}
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
          </div>
          
          {user?.role === 'ADMIN' && (
            <div className="space-y-3">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={formData.assigneeId}
                onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}
              >
                <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <span>{u.firstName} {u.lastName} ({u.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="transition-all hover:bg-accent/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="transition-all hover:bg-primary/90 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  // Fetch ticket details
  const { data: ticketData, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsAPI.getById(id!),
    enabled: !!id,
  });

  // Fetch users for assignee dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll(),
    enabled: user?.role === 'ADMIN',
  });

  // Update ticket mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => ticketsAPI.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketStats'] });
      setIsUpdateModalOpen(false);
      toast.success('Ticket updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentData: { content: string; isInternal?: boolean }) => 
      ticketsAPI.addComment(id!, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      setNewComment('');
      setIsInternalComment(false);
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });

  const ticket = ticketData?.data;
  const users = usersData?.data || [];

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
        return 'text-destructive';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
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

  const handleUpdateTicket = (formData: any) => {
    // The formData already has assigneeId properly converted in the modal's handleSubmit
    updateMutation.mutate(formData);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }
    commentMutation.mutate({
      content: newComment,
      isInternal: isInternalComment,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <Card>
            <CardContent className="pt-6">
              <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
        <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild>
          <Link to="/tickets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Link>
        </Button>
      </div>
    );
  }

  const canEdit = user?.role === 'ADMIN' || ticket.authorId === user?.id;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-accent/50">
            <Link to="/tickets">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{ticket.title}</h1>
            <p className="text-muted-foreground text-lg">Ticket #{ticket.id.slice(-8)}</p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={() => setIsUpdateModalOpen(true)} className="shadow-md hover:shadow-lg transition-all">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Ticket
          </Button>
        )}
      </div>

      {/* Ticket Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments ({ticket.comments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="space-y-4">
                  <Textarea
                    rows={4}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    {user?.role === 'ADMIN' && (
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          checked={isInternalComment}
                          onChange={(e) => setIsInternalComment(e.target.checked)}
                        />
                        <span className="text-sm flex items-center">
                          {isInternalComment ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                          Internal comment (only visible to admins)
                        </span>
                      </label>
                    )}
                    <Button
                      type="submit"
                      size="sm"
                      disabled={commentMutation.isPending || !newComment.trim()}
                      className="shadow-sm hover:shadow-md transition-all"
                    >
                      {commentMutation.isPending ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-1" />
                          Add Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
              {/* Comments List */}
              <div className="space-y-6">
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map((comment: Comment) => {
                    // Hide internal comments from non-admin users
                    if (comment.isInternal && user?.role !== 'ADMIN') {
                      return null;
                    }
                    
                    return (
                      <div key={comment.id} className="border rounded-lg p-6 hover:bg-accent/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">
                                {comment.author?.firstName} {comment.author?.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {comment.isInternal && (
                            <Badge variant="secondary" className="text-xs">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Internal
                            </Badge>
                          )}
                          {user && (
                            <CommentActions 
                              comment={comment} 
                              ticketId={ticket.id} 
                              currentUser={user} 
                            />
                          )}
                        </div>
                        <p className="whitespace-pre-wrap text-base leading-relaxed ml-13">{comment.content}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">No comments yet. Be the first to add one!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Attachments */}
          {user && (
            <AttachmentManager 
              ticketId={ticket.id}
              attachments={ticket.attachments || []}
              currentUser={user}
              ticketAuthorId={ticket.authorId}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Status & Priority */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status</Label>
                <Badge variant={getStatusBadgeVariant(ticket.status)} className="flex items-center w-fit mt-2 px-3 py-1">
                  {getStatusIcon(ticket.status)}
                  <span className="ml-2">{ticket.status.replace('_', ' ')}</span>
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Priority</Label>
                <div className={`font-semibold mt-2 text-lg ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Created</Label>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Last Updated</Label>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Author</Label>
                <div className="flex items-center mt-3">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {ticket.author?.firstName?.[0]}{ticket.author?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">
                      {ticket.author?.firstName} {ticket.author?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{ticket.author?.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Assignee</Label>
                {ticket.assignee ? (
                  <div className="flex items-center mt-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {ticket.assignee?.firstName?.[0]}{ticket.assignee?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {ticket.assignee?.firstName} {ticket.assignee?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{ticket.assignee?.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mt-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-muted-foreground/20 mr-3 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Unassigned</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Modal */}
      <UpdateTicketModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        ticket={ticket}
        onSubmit={handleUpdateTicket}
        isLoading={updateMutation.isPending}
        users={users}
      />
    </div>
  );
};