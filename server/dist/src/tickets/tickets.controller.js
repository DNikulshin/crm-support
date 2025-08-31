"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const tickets_service_1 = require("./tickets.service");
const ticket_dto_1 = require("./dto/ticket.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    create(createTicketDto, user) {
        return this.ticketsService.create(createTicketDto, user.id);
    }
    findAll(user, page = '1', limit = '10') {
        return this.ticketsService.findAll(user, parseInt(page), parseInt(limit));
    }
    getStatistics(user) {
        return this.ticketsService.getStatistics(user);
    }
    findOne(id, user) {
        return this.ticketsService.findOne(id, user);
    }
    update(id, updateTicketDto, user) {
        return this.ticketsService.update(id, updateTicketDto, user);
    }
    addComment(ticketId, createCommentDto, user) {
        return this.ticketsService.addComment(ticketId, createCommentDto, user.id, user);
    }
    updateComment(commentId, updateCommentDto, user) {
        return this.ticketsService.updateComment(commentId, updateCommentDto, user);
    }
    deleteComment(commentId, user) {
        return this.ticketsService.deleteComment(commentId, user);
    }
    uploadAttachment(ticketId, file, user) {
        return this.ticketsService.uploadAttachment(ticketId, file, user);
    }
    uploadMultipleAttachments(ticketId, files, user) {
        return this.ticketsService.uploadMultipleAttachments(ticketId, files, user);
    }
    deleteAttachment(attachmentId, user) {
        return this.ticketsService.deleteAttachment(attachmentId, user);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new ticket' }),
    (0, swagger_1.ApiBody)({ type: ticket_dto_1.CreateTicketDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ticket successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get tickets (filtered by user role)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page', example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tickets with pagination' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ticket statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ticket statistics',
        schema: {
            example: {
                total: 15,
                open: 5,
                inProgress: 3,
                resolved: 4,
                closed: 3
            }
        }
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ticket by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket details with comments' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only view own tickets' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    (0, swagger_1.ApiBody)({ type: ticket_dto_1.UpdateTicketDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only update own tickets' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_dto_1.UpdateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add comment to ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    (0, swagger_1.ApiBody)({ type: ticket_dto_1.CreateCommentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment successfully added' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only comment on own tickets' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Patch)('comments/:commentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update comment' }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'Comment ID' }),
    (0, swagger_1.ApiBody)({ type: ticket_dto_1.UpdateCommentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only update own comments' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_dto_1.UpdateCommentDto, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete comment' }),
    (0, swagger_1.ApiParam)({ name: 'commentId', description: 'Comment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only delete own comments' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)(':id/attachments'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload single attachment to ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File successfully uploaded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only upload to own tickets' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "uploadAttachment", null);
__decorate([
    (0, common_1.Post)(':id/attachments/multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple attachments to ticket' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Files successfully uploaded',
        schema: {
            type: 'object',
            properties: {
                attachments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            filename: { type: 'string' },
                            originalName: { type: 'string' },
                            mimeType: { type: 'string' },
                            size: { type: 'number' },
                            url: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                },
                message: { type: 'string' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only upload to own tickets' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No files uploaded or validation error' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "uploadMultipleAttachments", null);
__decorate([
    (0, common_1.Delete)('attachments/:attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete attachment' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', description: 'Attachment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attachment not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only delete attachments from own tickets' }),
    __param(0, (0, common_1.Param)('attachmentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "deleteAttachment", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('Tickets'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map