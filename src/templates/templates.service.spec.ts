/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let prisma: {
    documentTemplate: { findMany: jest.Mock; findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      documentTemplate: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  describe('findAll', () => {
    it('should return all templates', async () => {
      const templates = [
        {
          id: '1',
          name: 'PKWT',
          contract_type: 'PKWT',
          created_at: new Date(),
        },
      ];
      prisma.documentTemplate.findMany.mockResolvedValue(templates);

      const result = await service.findAll();
      expect(result).toEqual(templates);
    });

    it('should filter by contract type', async () => {
      prisma.documentTemplate.findMany.mockResolvedValue([]);
      await service.findAll('PKWT' as any);
      expect(prisma.documentTemplate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { contract_type: 'PKWT' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a template by id', async () => {
      const template = { id: '1', name: 'PKWT' };
      prisma.documentTemplate.findUnique.mockResolvedValue(template);

      const result = await service.findOne('1');
      expect(result).toEqual(template);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.documentTemplate.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
