import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractType } from '@prisma/client';

@Injectable()
export class ClausesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(contractType?: ContractType) {
    return this.prisma.clausesLibrary.findMany({
      where: contractType ? { contract_type: contractType } : undefined,
      orderBy: { title: 'asc' },
    });
  }
}
