import React, { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI, type Attachment, type User } from '../services/api';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  FileImage, 
  File, 
  Download,
  Trash2,
  Loader2,
  Plus,
  Paperclip
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface AttachmentManagerProps {
  ticketId: string;
  attachments: Attachment[];
  currentUser: User;
  ticketAuthorId: string;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({ 
  ticketId, 
  attachments, 
  currentUser,
  ticketAuthorId
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<Attachment | null>(null);

  // Check permissions
  const canUpload = currentUser.role === 'ADMIN' || ticketAuthorId === currentUser.id;
  const canDelete = (attachment: Attachment) => 
    currentUser.role === 'ADMIN' || ticketAuthorId === currentUser.id;

  // Upload attachment mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => ticketsAPI.uploadAttachment(ticketId, file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      toast.success(`File "${response.data.originalName}" uploaded successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    },
  });

  // Delete attachment mutation
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) => ticketsAPI.deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setDeleteDialogOpen(false);
      setAttachmentToDelete(null);
      toast.success('File deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // Process multiple files
    Array.from(files).forEach(file => {
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" is too large. Maximum size is 10MB`);
        return;
      }

      // Check file type (allow images and common document types)
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type "${file.type}" not supported for "${file.name}". Please upload images, PDFs, or documents.`);
        return;
      }

      uploadMutation.mutate(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!canUpload) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canUpload) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const handleDeleteClick = (attachment: Attachment) => {
    setAttachmentToDelete(attachment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (attachmentToDelete) {
      deleteMutation.mutate(attachmentToDelete.id);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const getFileUrl = (attachment: Attachment) => {
    // If the URL is relative, prepend the API base URL
    if (attachment.url.startsWith('/')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      return `${apiUrl}${attachment.url}`;
    }
    return attachment.url;
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Paperclip className="h-5 w-5 mr-2" />
            Attachments ({attachments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          {canUpload && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('accept', 'image/*');
                        fileInputRef.current.click();
                      }
                    }}
                    className="flex items-center space-x-2"
                  >
                    <FileImage className="h-4 w-4" />
                    <span>Upload Photos</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
                        fileInputRef.current.click();
                      }
                    }}
                    className="flex items-center space-x-2"
                  >
                    <File className="h-4 w-4" />
                    <span>Upload Files</span>
                  </Button>
                </div>
              </div>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleInputChange}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  multiple
                />
                
                {uploadMutation.isPending ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Uploading file...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or{' '}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max file size: 10MB per file. Multiple files supported. Supported formats: Images, PDF, DOC, TXT
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Image Gallery for Photos */}
          {attachments.some(a => a.mimeType.startsWith('image/')) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FileImage className="h-5 w-5 mr-2" />
                Photos ({attachments.filter(a => a.mimeType.startsWith('image/')).length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {attachments
                  .filter(attachment => attachment.mimeType.startsWith('image/'))
                  .map((attachment) => (
                    <div key={attachment.id} className="group relative">
                      <div className="aspect-square rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                        <img
                          src={getFileUrl(attachment)}
                          alt={attachment.originalName}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(getFileUrl(attachment), '_blank')}
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a
                            href={getFileUrl(attachment)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={attachment.originalName}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        
                        {canDelete(attachment) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteClick(attachment)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate" title={attachment.originalName}>
                        {attachment.originalName}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Other Files List */}
          <div className="space-y-3">
            {attachments.filter(a => !a.mimeType.startsWith('image/')).length > 0 && (
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <File className="h-5 w-5 mr-2" />
                Documents ({attachments.filter(a => !a.mimeType.startsWith('image/')).length})
              </h4>
            )}
            {attachments.length > 0 ? (
              attachments
                .filter(attachment => !attachment.mimeType.startsWith('image/'))
                .map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0 text-muted-foreground">
                      {getFileIcon(attachment.mimeType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" title={attachment.originalName}>
                        {attachment.originalName}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(attachment.size)}</span>
                        <span>•</span>
                        <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <a
                        href={getFileUrl(attachment)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={attachment.originalName}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    
                    {canDelete(attachment) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(attachment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !attachments.some(a => a.mimeType.startsWith('image/')) && (
                <div className="text-center py-8">
                  <Paperclip className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-lg">No attachments yet</p>
                  {canUpload && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload files to share additional information
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{attachmentToDelete?.originalName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
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