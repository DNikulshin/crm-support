import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, CreateCommentDto, UpdateCommentDto, CreateAttachmentDto } from './dto/ticket.dto';
import { UserRole, TicketStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto, creatorId: string) {
    const ticket = await this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        attachments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
    });

    return ticket;
  }

  async findAll(currentUser: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Build where clause based on user role
    const whereClause: any = {};
    
    // Regular users can only see their own tickets
    if (currentUser.role === UserRole.USER) {
      whereClause.creatorId = currentUser.id;
    }
    // Admins can see all tickets

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          attachments: {
            orderBy: {
              createdAt: 'asc',
            },
          },
          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.ticket.count({ where: whereClause }),
    ]);

    // Filter internal comments for non-admin users
    if (currentUser.role !== UserRole.ADMIN) {
      tickets.forEach(ticket => {
        ticket.comments = ticket.comments.filter(comment => !comment.isInternal);
      });
    }

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        attachments: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check access permissions
    if (currentUser.role === UserRole.USER && ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only view your own tickets');
    }

    // Filter internal comments for non-admin users
    if (currentUser.role !== UserRole.ADMIN) {
      ticket.comments = ticket.comments.filter(comment => !comment.isInternal);
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, currentUser: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check permissions
    if (currentUser.role === UserRole.USER) {
      // Users can only update their own tickets and only certain fields
      if (ticket.creatorId !== currentUser.id) {
        throw new ForbiddenException('You can only update your own tickets');
      }
      // Users cannot change status or assignee
      delete updateTicketDto.status;
      delete updateTicketDto.assigneeId;
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        attachments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
    });

    // Filter internal comments for non-admin users
    if (currentUser.role !== UserRole.ADMIN) {
      updatedTicket.comments = updatedTicket.comments.filter(comment => !comment.isInternal);
    }

    return updatedTicket;
  }

  async addComment(ticketId: string, createCommentDto: CreateCommentDto, authorId: string, currentUser: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check access permissions
    if (currentUser.role === UserRole.USER && ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only comment on your own tickets');
    }

    // Only admins can create internal comments
    if (createCommentDto.isInternal && currentUser.role !== UserRole.ADMIN) {
      createCommentDto.isInternal = false;
    }

    const comment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        ticketId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return comment;
  }

  async getStatistics(currentUser: any) {
    // Build where clause based on user role
    const whereClause: any = {};
    
    if (currentUser.role === UserRole.USER) {
      whereClause.creatorId = currentUser.id;
    }

    const [total, open, inProgress, resolved, closed] = await Promise.all([
      this.prisma.ticket.count({ where: whereClause }),
      this.prisma.ticket.count({ where: { ...whereClause, status: TicketStatus.OPEN } }),
      this.prisma.ticket.count({ where: { ...whereClause, status: TicketStatus.IN_PROGRESS } }),
      this.prisma.ticket.count({ where: { ...whereClause, status: TicketStatus.RESOLVED } }),
      this.prisma.ticket.count({ where: { ...whereClause, status: TicketStatus.CLOSED } }),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
    };
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto, currentUser: any) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        ticket: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check permissions
    if (currentUser.role !== UserRole.ADMIN && comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    // Check if user can access the ticket
    if (currentUser.role === UserRole.USER && comment.ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only access comments on your own tickets');
    }

    // Only admins can modify internal flag
    if (updateCommentDto.isInternal !== undefined && currentUser.role !== UserRole.ADMIN) {
      delete updateCommentDto.isInternal;
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedComment;
  }

  async deleteComment(commentId: string, currentUser: any) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        ticket: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check permissions
    if (currentUser.role !== UserRole.ADMIN && comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Check if user can access the ticket
    if (currentUser.role === UserRole.USER && comment.ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only access comments on your own tickets');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }

  async uploadAttachment(ticketId: string, file: Express.Multer.File, currentUser: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check access permissions
    if (currentUser.role === UserRole.USER && ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only upload files to your own tickets');
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);
    const url = `/uploads/${filename}`;

    // Save file to uploads directory
    await fs.promises.writeFile(filepath, file.buffer);

    const attachment = await this.prisma.attachment.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        ticketId,
      },
    });

    return attachment;
  }

  async uploadMultipleAttachments(ticketId: string, files: Express.Multer.File[], currentUser: any) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check access permissions
    if (currentUser.role === UserRole.USER && ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only upload files to your own tickets');
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const attachments: any[] = [];
    const errors: string[] = [];

    // Process each file
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        
        // Validate file size (max 10MB per file)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`File "${file.originalname}" is too large. Maximum size is 10MB.`);
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now() + i; // Add index to ensure uniqueness
        const extension = path.extname(file.originalname);
        const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = path.join(uploadsDir, filename);
        const url = `/uploads/${filename}`;

        // Save file to uploads directory
        await fs.promises.writeFile(filepath, file.buffer);

        // Create database entry
        const attachment = await this.prisma.attachment.create({
          data: {
            filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url,
            ticketId,
          },
        });

        attachments.push(attachment);
      } catch (error) {
        errors.push(`Failed to upload "${files[i].originalname}": ${error.message}`);
      }
    }

    const result = {
      attachments,
      message: `Successfully uploaded ${attachments.length} file(s)`,
    };

    if (errors.length > 0) {
      result.message += `. ${errors.length} file(s) failed to upload.`;
      (result as any).errors = errors;
    }

    return result;
  }

  async deleteAttachment(attachmentId: string, currentUser: any) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        ticket: true,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Check permissions
    if (currentUser.role === UserRole.USER && attachment.ticket.creatorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete attachments from your own tickets');
    }

    // Delete file from filesystem
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filepath = path.join(uploadsDir, attachment.filename);
    try {
      await fs.promises.unlink(filepath);
    } catch (error) {
      // File might not exist, continue with database deletion
      console.warn(`Failed to delete file ${filepath}:`, error.message);
    }

    await this.prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return { message: 'Attachment deleted successfully' };
  }
}