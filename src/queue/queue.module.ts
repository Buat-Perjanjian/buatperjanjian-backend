import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service.js';
import { AiProcessor } from './processors/ai.processor.js';
import { PdfProcessor } from './processors/pdf.processor.js';
import { EmailProcessor } from './processors/email.processor.js';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'ai' },
      { name: 'pdf' },
      { name: 'email' },
    ),
  ],
  providers: [QueueService, AiProcessor, PdfProcessor, EmailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
