import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContractType, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly priceMap: Record<string, number> = {
    [ContractType.PKWT]: 50000,
    [ContractType.PKWTT]: 75000,
    [ContractType.Freelance]: 100000,
    [ContractType.NDA]: 150000,
  };

  constructor(private readonly prisma: PrismaService) {}

  async createPayment(userId: string, documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { company: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (document.company.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this document');
    }

    const amount =
      this.priceMap[document.contract_type ?? ContractType.PKWT] ?? 50000;

    const payment = await this.prisma.payment.create({
      data: {
        user_id: userId,
        document_id: documentId,
        amount,
        status: PaymentStatus.pending,
        payment_provider: 'midtrans',
      },
    });

    // Mock Midtrans payment URL
    const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${payment.id}`;

    return {
      payment_id: payment.id,
      payment_url: paymentUrl,
      amount: payment.amount,
    };
  }

  async handleWebhook(body: { order_id: string; transaction_status: string }) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: body.order_id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    let newStatus: PaymentStatus;
    switch (body.transaction_status) {
      case 'capture':
      case 'settlement':
        newStatus = PaymentStatus.paid;
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        newStatus = PaymentStatus.failed;
        break;
      default:
        newStatus = PaymentStatus.pending;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: newStatus },
    });

    await this.prisma.paymentLog.create({
      data: {
        payment_id: payment.id,
        provider_response: body as any,
      },
    });

    // Update document status to paid if payment succeeded
    if (newStatus === PaymentStatus.paid) {
      await this.prisma.document.update({
        where: { id: payment.document_id },
        data: { status: 'paid' },
      });
    }

    return { status: 'ok' };
  }
}
