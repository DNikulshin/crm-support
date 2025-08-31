import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, CreateCommentDto, UpdateCommentDto } from './dto/ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ status: 201, description: 'Ticket successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createTicketDto: CreateTicketDto, @GetUser() user: any) {
    return this.ticketsService.create(createTicketDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tickets (filtered by user role)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of tickets with pagination' })
  findAll(
    @GetUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.ticketsService.findAll(user, parseInt(page), parseInt(limit));
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get ticket statistics' })
  @ApiResponse({ 
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
  })
  getStatistics(@GetUser() user: any) {
    return this.ticketsService.getStatistics(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket details with comments' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only view own tickets' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiBody({ type: UpdateTicketDto })
  @ApiResponse({ status: 200, description: 'Ticket successfully updated' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own tickets' })
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @GetUser() user: any,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment successfully added' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only comment on own tickets' })
  addComment(
    @Param('id') ticketId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: any,
  ) {
    return this.ticketsService.addComment(ticketId, createCommentDto, user.id, user);
  }

  @Patch('comments/:commentId')
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: 'Comment successfully updated' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own comments' })
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: any,
  ) {
    return this.ticketsService.updateComment(commentId, updateCommentDto, user);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'commentId', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own comments' })
  deleteComment(
    @Param('commentId') commentId: string,
    @GetUser() user: any,
  ) {
    return this.ticketsService.deleteComment(commentId, user);
  }

  @Post(':id/attachments')
  @ApiOperation({ summary: 'Upload single attachment to ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File successfully uploaded' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only upload to own tickets' })
  @UseInterceptors(FileInterceptor('file'))
  uploadAttachment(
    @Param('id') ticketId: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: any,
  ) {
    return this.ticketsService.uploadAttachment(ticketId, file, user);
  }

  @Post(':id/attachments/multiple')
  @ApiOperation({ summary: 'Upload multiple attachments to ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only upload to own tickets' })
  @ApiResponse({ status: 400, description: 'No files uploaded or validation error' })
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  uploadMultipleAttachments(
    @Param('id') ticketId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: any,
  ) {
    return this.ticketsService.uploadMultipleAttachments(ticketId, files, user);
  }

  @Delete('attachments/:attachmentId')
  @ApiOperation({ summary: 'Delete attachment' })
  @ApiParam({ name: 'attachmentId', description: 'Attachment ID' })
  @ApiResponse({ status: 200, description: 'Attachment successfully deleted' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete attachments from own tickets' })
  deleteAttachment(
    @Param('attachmentId') attachmentId: string,
    @GetUser() user: any,
  ) {
    return this.ticketsService.deleteAttachment(attachmentId, user);
  }
}