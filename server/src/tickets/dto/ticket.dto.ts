import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Ticket title',
    example: 'Login Issues'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the issue',
    example: 'Unable to login to the system with correct credentials'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Ticket priority level',
    enum: TicketPriority,
    example: TicketPriority.MEDIUM
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;
}

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'Ticket title',
    example: 'Updated Login Issues'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the issue',
    example: 'Updated description of login issues'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Ticket status',
    enum: TicketStatus,
    example: TicketStatus.IN_PROGRESS
  })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Ticket priority level',
    enum: TicketPriority,
    example: TicketPriority.HIGH
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({
    description: 'ID of user assigned to handle this ticket (Admin only)',
    example: 'clp1234567890'
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'I tried resetting my password but the issue persists.'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Whether this comment is internal (visible only to admins)',
    example: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Updated comment content',
    example: 'Updated: I tried resetting my password but the issue persists.'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Whether this comment is internal (visible only to admins)',
    example: false
  })
  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;
}

export class CreateAttachmentDto {
  @ApiProperty({
    description: 'Original filename',
    example: 'document.pdf'
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf'
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000
  })
  size: number;

  @ApiProperty({
    description: 'Storage filename',
    example: 'uploads/1234567890-document.pdf'
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({
    description: 'File URL',
    example: '/uploads/1234567890-document.pdf'
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}