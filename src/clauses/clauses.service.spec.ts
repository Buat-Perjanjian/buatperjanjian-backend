/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ClausesService } from './clauses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClausesService', () => {
  let service: ClausesService;
  let prisma: { clausesLibrary: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = { clausesLibrary: { findMany: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ClausesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ClausesService>(ClausesService);
  });

  it('should return all clauses', async () => {
    const clauses = [{ id: '1', title: 'Force Majeure' }];
    prisma.clausesLibrary.findMany.mockResolvedValue(clauses);

    const result = await service.findAll();
    expect(result).toEqual(clauses);
  });

  it('should filter by contract type', async () => {
    prisma.clausesLibrary.findMany.mockResolvedValue([]);
    await service.findAll('PKWT' as any);
    expect(prisma.clausesLibrary.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { contract_type: 'PKWT' },
      }),
    );
  });
});
