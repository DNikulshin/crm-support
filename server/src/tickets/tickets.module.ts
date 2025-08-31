import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import * as multer from 'multer';
import * as path from 'path';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: multer.memoryStorage(), // Store files in memory for processing
      fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedMimes = [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'text/csv',
          'application/zip',
          'application/x-rar-compressed'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`File type ${file.mimetype} is not allowed`), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10, // Maximum 10 files per request
      },
    }),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}