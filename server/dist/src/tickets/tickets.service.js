"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTicketDto, creatorId) {
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
    async findAll(currentUser, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (currentUser.role === client_1.UserRole.USER) {
            whereClause.creatorId = currentUser.id;
        }
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
        if (currentUser.role !== client_1.UserRole.ADMIN) {
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
    async findOne(id, currentUser) {
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
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (currentUser.role === client_1.UserRole.USER && ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only view your own tickets');
        }
        if (currentUser.role !== client_1.UserRole.ADMIN) {
            ticket.comments = ticket.comments.filter(comment => !comment.isInternal);
        }
        return ticket;
    }
    async update(id, updateTicketDto, currentUser) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (currentUser.role === client_1.UserRole.USER) {
            if (ticket.creatorId !== currentUser.id) {
                throw new common_1.ForbiddenException('You can only update your own tickets');
            }
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
        if (currentUser.role !== client_1.UserRole.ADMIN) {
            updatedTicket.comments = updatedTicket.comments.filter(comment => !comment.isInternal);
        }
        return updatedTicket;
    }
    async addComment(ticketId, createCommentDto, authorId, currentUser) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (currentUser.role === client_1.UserRole.USER && ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only comment on your own tickets');
        }
        if (createCommentDto.isInternal && currentUser.role !== client_1.UserRole.ADMIN) {
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
    async getStatistics(currentUser) {
        const whereClause = {};
        if (currentUser.role === client_1.UserRole.USER) {
            whereClause.creatorId = currentUser.id;
        }
        const [total, open, inProgress, resolved, closed] = await Promise.all([
            this.prisma.ticket.count({ where: whereClause }),
            this.prisma.ticket.count({ where: { ...whereClause, status: client_1.TicketStatus.OPEN } }),
            this.prisma.ticket.count({ where: { ...whereClause, status: client_1.TicketStatus.IN_PROGRESS } }),
            this.prisma.ticket.count({ where: { ...whereClause, status: client_1.TicketStatus.RESOLVED } }),
            this.prisma.ticket.count({ where: { ...whereClause, status: client_1.TicketStatus.CLOSED } }),
        ]);
        return {
            total,
            open,
            inProgress,
            resolved,
            closed,
        };
    }
    async updateComment(commentId, updateCommentDto, currentUser) {
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
            throw new common_1.NotFoundException('Comment not found');
        }
        if (currentUser.role !== client_1.UserRole.ADMIN && comment.authorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only update your own comments');
        }
        if (currentUser.role === client_1.UserRole.USER && comment.ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only access comments on your own tickets');
        }
        if (updateCommentDto.isInternal !== undefined && currentUser.role !== client_1.UserRole.ADMIN) {
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
    async deleteComment(commentId, currentUser) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                ticket: true,
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (currentUser.role !== client_1.UserRole.ADMIN && comment.authorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        if (currentUser.role === client_1.UserRole.USER && comment.ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only access comments on your own tickets');
        }
        await this.prisma.comment.delete({
            where: { id: commentId },
        });
        return { message: 'Comment deleted successfully' };
    }
    async uploadAttachment(ticketId, file, currentUser) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (currentUser.role === client_1.UserRole.USER && ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only upload files to your own tickets');
        }
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = path.join(uploadsDir, filename);
        const url = `/uploads/${filename}`;
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
    async uploadMultipleAttachments(ticketId, files, currentUser) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (currentUser.role === client_1.UserRole.USER && ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only upload files to your own tickets');
        }
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const attachments = [];
        const errors = [];
        for (let i = 0; i < files.length; i++) {
            try {
                const file = files[i];
                if (file.size > 10 * 1024 * 1024) {
                    errors.push(`File "${file.originalname}" is too large. Maximum size is 10MB.`);
                    continue;
                }
                const timestamp = Date.now() + i;
                const extension = path.extname(file.originalname);
                const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const filepath = path.join(uploadsDir, filename);
                const url = `/uploads/${filename}`;
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
                attachments.push(attachment);
            }
            catch (error) {
                errors.push(`Failed to upload "${files[i].originalname}": ${error.message}`);
            }
        }
        const result = {
            attachments,
            message: `Successfully uploaded ${attachments.length} file(s)`,
        };
        if (errors.length > 0) {
            result.message += `. ${errors.length} file(s) failed to upload.`;
            result.errors = errors;
        }
        return result;
    }
    async deleteAttachment(attachmentId, currentUser) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id: attachmentId },
            include: {
                ticket: true,
            },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('Attachment not found');
        }
        if (currentUser.role === client_1.UserRole.USER && attachment.ticket.creatorId !== currentUser.id) {
            throw new common_1.ForbiddenException('You can only delete attachments from your own tickets');
        }
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filepath = path.join(uploadsDir, attachment.filename);
        try {
            await fs.promises.unlink(filepath);
        }
        catch (error) {
            console.warn(`Failed to delete file ${filepath}:`, error.message);
        }
        await this.prisma.attachment.delete({
            where: { id: attachmentId },
        });
        return { message: 'Attachment deleted successfully' };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map