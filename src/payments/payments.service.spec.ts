import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: {
    document: { findUnique: jest.Mock; update: jest.Mock };
    payment: { create: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    paymentLog: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      document: { findUnique: jest.fn(), update: jest.fn() },
      payment: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      paymentLog: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('createPayment', () => {
    it('should create a payment and return payment URL', async () => {
      prisma.document.findUnique.mockResolvedValue({
        id: 'doc-1',
        contract_type: 'PKWT',
        company: { user_id: 'user-1' },
      });
      prisma.payment.create.mockResolvedValue({
        id: 'pay-1',
        amount: 50000,
      });

      const result = await service.createPayment('user-1', 'doc-1');
      expect(result.payment_id).toBe('pay-1');
      expect(result.amount).toBe(50000);
      expect(result.payment_url).toContain('pay-1');
    });

    it('should throw NotFoundException if document not found', async () => {
      prisma.document.findUnique.mockResolvedValue(null);
      await expect(
        service.createPayment('user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own document', async () => {
      prisma.document.findUnique.mockResolvedValue({
        id: 'doc-1',
        company: { user_id: 'other-user' },
      });
      await expect(service.createPayment('user-1', 'doc-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('handleWebhook', () => {
    it('should update payment status to paid on settlement', async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: 'pay-1',
        document_id: 'doc-1',
      });
      prisma.payment.update.mockResolvedValue({});
      prisma.paymentLog.create.mockResolvedValue({});
      prisma.document.update.mockResolvedValue({});

      const result = await service.handleWebhook({
        order_id: 'pay-1',
        transaction_status: 'settlement',
      });

      expect(result).toEqual({ status: 'ok' });
      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'paid' },
        }),
      );
    });

    it('should throw NotFoundException if payment not found', async () => {
      prisma.payment.findUnique.mockResolvedValue(null);
      await expect(
        service.handleWebhook({
          order_id: 'nope',
          transaction_status: 'settlement',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
