import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, CreateCommentDto, UpdateCommentDto } from './dto/ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto, user: any): Promise<{
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
    findAll(user: any, page?: string, limit?: string): Promise<{
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
    getStatistics(user: any): Promise<{
        total: number;
        open: number;
        inProgress: number;
        resolved: number;
        closed: number;
    }>;
    findOne(id: string, user: any): Promise<{
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
    update(id: string, updateTicketDto: UpdateTicketDto, user: any): Promise<{
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
    addComment(ticketId: string, createCommentDto: CreateCommentDto, user: any): Promise<{
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
    updateComment(commentId: string, updateCommentDto: UpdateCommentDto, user: any): Promise<{
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
    deleteComment(commentId: string, user: any): Promise<{
        message: string;
    }>;
    uploadAttachment(ticketId: string, file: Express.Multer.File, user: any): Promise<{
        id: string;
        createdAt: Date;
        ticketId: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }>;
    uploadMultipleAttachments(ticketId: string, files: Express.Multer.File[], user: any): Promise<{
        attachments: any[];
        message: string;
    }>;
    deleteAttachment(attachmentId: string, user: any): Promise<{
        message: string;
    }>;
}
