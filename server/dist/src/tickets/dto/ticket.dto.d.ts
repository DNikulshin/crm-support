import { TicketStatus, TicketPriority } from '@prisma/client';
export declare class CreateTicketDto {
    title: string;
    description: string;
    priority?: TicketPriority;
}
export declare class UpdateTicketDto {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    assigneeId?: string;
}
export declare class CreateCommentDto {
    content: string;
    isInternal?: boolean;
}
export declare class UpdateCommentDto {
    content?: string;
    isInternal?: boolean;
}
export declare class CreateAttachmentDto {
    originalName: string;
    mimeType: string;
    size: number;
    filename: string;
    url: string;
}
