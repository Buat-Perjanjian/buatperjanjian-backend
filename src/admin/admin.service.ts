import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { UpdateTemplateDto } from './dto/update-template.dto.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          full_name: true,
          role: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async createTemplate(dto: CreateTemplateDto) {
    return this.prisma.documentTemplate.create({
      data: {
        name: dto.name,
        contract_type: dto.contract_type,
        template_html: dto.template_html,
        template_schema: dto.template_schema ?? undefined,
      },
    });
  }

  async updateTemplate(id: string, dto: UpdateTemplateDto) {
    const existing = await this.prisma.documentTemplate.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Template not found');
    }

    return this.prisma.documentTemplate.update({
      where: { id },
      data: {
        name: dto.name,
        contract_type: dto.contract_type,
        template_html: dto.template_html,
        template_schema: dto.template_schema ?? undefined,
      },
    });
  }

  async deleteTemplate(id: string) {
    const existing = await this.prisma.documentTemplate.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Template not found');
    }

    await this.prisma.documentTemplate.delete({ where: { id } });
    return { message: 'Template deleted' };
  }
}
