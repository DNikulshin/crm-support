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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAttachmentDto = exports.UpdateCommentDto = exports.CreateCommentDto = exports.UpdateTicketDto = exports.CreateTicketDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateTicketDto {
    title;
    description;
    priority;
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ticket title',
        example: 'Login Issues'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of the issue',
        example: 'Unable to login to the system with correct credentials'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ticket priority level',
        enum: client_1.TicketPriority,
        example: client_1.TicketPriority.MEDIUM
    }),
    (0, class_validator_1.IsEnum)(client_1.TicketPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "priority", void 0);
class UpdateTicketDto {
    title;
    description;
    status;
    priority;
    assigneeId;
}
exports.UpdateTicketDto = UpdateTicketDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ticket title',
        example: 'Updated Login Issues'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed description of the issue',
        example: 'Updated description of login issues'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ticket status',
        enum: client_1.TicketStatus,
        example: client_1.TicketStatus.IN_PROGRESS
    }),
    (0, class_validator_1.IsEnum)(client_1.TicketStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ticket priority level',
        enum: client_1.TicketPriority,
        example: client_1.TicketPriority.HIGH
    }),
    (0, class_validator_1.IsEnum)(client_1.TicketPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user assigned to handle this ticket (Admin only)',
        example: 'clp1234567890'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "assigneeId", void 0);
class CreateCommentDto {
    content;
    isInternal;
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment content',
        example: 'I tried resetting my password but the issue persists.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this comment is internal (visible only to admins)',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCommentDto.prototype, "isInternal", void 0);
class UpdateCommentDto {
    content;
    isInternal;
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Updated comment content',
        example: 'Updated: I tried resetting my password but the issue persists.'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this comment is internal (visible only to admins)',
        example: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCommentDto.prototype, "isInternal", void 0);
class CreateAttachmentDto {
    originalName;
    mimeType;
    size;
    filename;
    url;
}
exports.CreateAttachmentDto = CreateAttachmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original filename',
        example: 'document.pdf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File MIME type',
        example: 'application/pdf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File size in bytes',
        example: 1024000
    }),
    __metadata("design:type", Number)
], CreateAttachmentDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Storage filename',
        example: 'uploads/1234567890-document.pdf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'File URL',
        example: '/uploads/1234567890-document.pdf'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "url", void 0);
//# sourceMappingURL=ticket.dto.js.map