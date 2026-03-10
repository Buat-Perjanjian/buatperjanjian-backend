import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileType } from '@prisma/client';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  private detectFileType(mimetype: string): FileType {
    if (mimetype === 'application/pdf') return FileType.pdf;
    if (
      mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      return FileType.docx;
    if (mimetype.startsWith('image/')) return FileType.image;
    return FileType.other;
  }

  async uploadFile(userId: string, file: Express.Multer.File) {
    const fileUrl = `/uploads/${file.filename}`;
    const fileType = this.detectFileType(file.mimetype);

    const record = await this.prisma.uploadedFile.create({
      data: {
        user_id: userId,
        file_url: fileUrl,
        file_type: fileType,
      },
    });

    return {
      file_url: record.file_url,
      file_type: record.file_type,
    };
  }
}
