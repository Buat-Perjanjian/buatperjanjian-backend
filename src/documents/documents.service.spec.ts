/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      document: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      documentVersion: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      documentTemplate: { findFirst: jest.fn(), findUnique: jest.fn() },
      company: { findUnique: jest.fn(), findMany: jest.fn() },
      clausesLibrary: { findUnique: jest.fn() },
      documentClause: { findFirst: jest.fn(), create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  describe('create', () => {
    it('should create a document with version', async () => {
      prisma.company.findUnique.mockResolvedValue({
        id: 'comp-1',
        user_id: 'user-1',
      });
      prisma.documentTemplate.findFirst.mockResolvedValue({ id: 'tmpl-1' });
      prisma.document.create.mockResolvedValue({
        id: 'doc-1',
        versions: [{ id: 'v-1', version_number: 1 }],
      });

      const result = await service.create('user-1', {
        company_id: 'comp-1',
        contract_type: 'PKWT' as any,
        title: 'Test Contract',
      });

      expect(result.id).toBe('doc-1');
    });

    it('should throw NotFoundException if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      await expect(
        service.create('user-1', {
          company_id: 'nope',
          contract_type: 'PKWT' as any,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if company not owned', async () => {
      prisma.company.findUnique.mockResolvedValue({
        id: 'comp-1',
        user_id: 'other-user',
      });
      await expect(
        service.create('user-1', {
          company_id: 'comp-1',
          contract_type: 'PKWT' as any,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return document with relations', async () => {
      prisma.document.findUnique.mockResolvedValue({
        id: 'doc-1',
        company: { user_id: 'user-1' },
      });

      const result = await service.findOne('doc-1', 'user-1');
      expect(result.id).toBe('doc-1');
    });

    it('should throw NotFoundException', async () => {
      prisma.document.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nope', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not owner', async () => {
      prisma.document.findUnique.mockResolvedValue({
        id: 'doc-1',
        company: { user_id: 'other' },
      });
      await expect(service.findOne('doc-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete document', async () => {
      prisma.document.findUnique.mockResolvedValue({
        id: 'doc-1',
        company: { user_id: 'user-1' },
      });
      prisma.document.delete.mockResolvedValue({});

      const result = await service.remove('doc-1', 'user-1');
      expect(result).toEqual({ message: 'Document deleted' });
    });
  });

  describe('findAll', () => {
    it('should return documents for user companies', async () => {
      prisma.company.findMany.mockResolvedValue([{ id: 'comp-1' }]);
      prisma.document.findMany.mockResolvedValue([{ id: 'doc-1' }]);

      const result = await service.findAll('user-1');
      expect(result).toHaveLength(1);
    });
  });
});
