import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        user_id: userId,
        ...dto,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.company.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }
}
