import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI, type Comment, type User } from '../services/api';
import { toast } from 'sonner';
import { 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Save,
  X,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface CommentActionsProps {
  comment: Comment;
  ticketId: string;
  currentUser: User;
}

export const CommentActions: React.FC<CommentActionsProps> = ({ 
  comment, 
  ticketId, 
  currentUser 
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editIsInternal, setEditIsInternal] = useState(comment.isInternal);

  // Check permissions
  const canEdit = currentUser.role === 'ADMIN' || comment.authorId === currentUser.id;
  const canDelete = currentUser.role === 'ADMIN' || comment.authorId === currentUser.id;

  // Update comment mutation
  const updateMutation = useMutation({
    mutationFn: (data: { content: string; isInternal?: boolean }) => 
      ticketsAPI.updateComment(comment.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setIsEditing(false);
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    },
  });

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: () => ticketsAPI.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setIsDeleteDialogOpen(false);
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });

  const handleEdit = () => {
    setEditContent(comment.content);
    setEditIsInternal(comment.isInternal);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }
    updateMutation.mutate({
      content: editContent,
      isInternal: editIsInternal,
    });
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setEditIsInternal(comment.isInternal);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  // Don't show actions if user has no permissions
  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <>
      {isEditing ? (
        <div className="mt-4 space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="resize-none"
            placeholder="Edit your comment..."
          />
          {currentUser.role === 'ADMIN' && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-input"
                checked={editIsInternal}
                onChange={(e) => setEditIsInternal(e.target.checked)}
              />
              <span className="text-sm flex items-center">
                {editIsInternal ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                Internal comment (only visible to admins)
              </span>
            </label>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending || !editContent.trim()}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Save className="h-3 w-3 mr-1" />
              )}
              Save
            </Button>
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit comment
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete comment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};