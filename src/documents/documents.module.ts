import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PdfService } from './pdf.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PdfService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
