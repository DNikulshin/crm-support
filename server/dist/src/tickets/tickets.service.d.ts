import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, CreateCommentDto, UpdateCommentDto } from './dto/ticket.dto';
export declare class TicketsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTicketDto: CreateTicketDto, creatorId: string): Promise<{
        creator: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        comments: ({
            author: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            isInternal: boolean;
            ticketId: string;
            authorId: string;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            ticketId: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
        }[];
        _count: {
            comments: number;
            attachments: number;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        priority: import("@prisma/client").$Enums.TicketPriority;
        createdAt: Date;
        updatedAt: Date;
        resolvedAt: Date | null;
        creatorId: string;
        assigneeId: string | null;
    }>;
    findAll(currentUser: any, page?: number, limit?: number): Promise<{
        tickets: ({
            creator: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            assignee: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
            comments: ({
                author: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                isInternal: boolean;
                ticketId: string;
                authorId: string;
            })[];
            attachments: {
                id: string;
                createdAt: Date;
                ticketId: string;
                filename: string;
                originalName: string;
                mimeType: string;
                size: number;
                url: string;
            }[];
            _count: {
                comments: number;
                attachments: number;
            };
        } & {
            id: string;
            title: string;
            description: string;
            status: import("@prisma/client").$Enums.TicketStatus;
            priority: import("@prisma/client").$Enums.TicketPriority;
            createdAt: Date;
            updatedAt: Date;
            resolvedAt: Date | null;
            creatorId: string;
            assigneeId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string, currentUser: any): Promise<{
        creator: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        comments: ({
            author: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            isInternal: boolean;
            ticketId: string;
            authorId: string;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            ticketId: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        priority: import("@prisma/client").$Enums.TicketPriority;
        createdAt: Date;
        updatedAt: Date;
        resolvedAt: Date | null;
        creatorId: string;
        assigneeId: string | null;
    }>;
    update(id: string, updateTicketDto: UpdateTicketDto, currentUser: any): Promise<{
        creator: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        comments: ({
            author: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            isInternal: boolean;
            ticketId: string;
            authorId: string;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            ticketId: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
        }[];
        _count: {
            comments: number;
            attachments: number;
        };
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        priority: import("@prisma/client").$Enums.TicketPriority;
        createdAt: Date;
        updatedAt: Date;
        resolvedAt: Date | null;
        creatorId: string;
        assigneeId: string | null;
    }>;
    addComment(ticketId: string, createCommentDto: CreateCommentDto, authorId: string, currentUser: any): Promise<{
        author: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isInternal: boolean;
        ticketId: string;
        authorId: string;
    }>;
    getStatistics(currentUser: any): Promise<{
        total: number;
        open: number;
        inProgress: number;
        resolved: number;
        closed: number;
    }>;
    updateComment(commentId: string, updateCommentDto: UpdateCommentDto, currentUser: any): Promise<{
        author: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isInternal: boolean;
        ticketId: string;
        authorId: string;
    }>;
    deleteComment(commentId: string, currentUser: any): Promise<{
        message: string;
    }>;
    uploadAttachment(ticketId: string, file: Express.Multer.File, currentUser: any): Promise<{
        id: string;
        createdAt: Date;
        ticketId: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }>;
    uploadMultipleAttachments(ticketId: string, files: Express.Multer.File[], currentUser: any): Promise<{
        attachments: any[];
        message: string;
    }>;
    deleteAttachment(attachmentId: string, currentUser: any): Promise<{
        message: string;
    }>;
}
