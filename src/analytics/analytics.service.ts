import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      total_users,
      total_documents,
      total_payments,
      revenueAgg,
      total_ai_requests,
      docsByStatus,
      docsByType,
      recent_activity,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.document.count(),
      this.prisma.payment.count({ where: { status: 'paid' } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'paid' },
      }),
      this.prisma.aiRequest.count(),
      this.prisma.document.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.document.groupBy({
        by: ['contract_type'],
        _count: { id: true },
      }),
      this.prisma.activityLog.findMany({
        take: 20,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, full_name: true },
          },
        },
      }),
    ]);

    const documents_by_status: Record<string, number> = {};
    for (const row of docsByStatus) {
      documents_by_status[row.status] = row._count.id;
    }

    const documents_by_type: Record<string, number> = {};
    for (const row of docsByType) {
      if (row.contract_type) {
        documents_by_type[row.contract_type] = row._count.id;
      }
    }

    return {
      total_users,
      total_documents,
      total_payments,
      total_revenue: revenueAgg._sum.amount ?? 0,
      total_ai_requests,
      documents_by_status,
      documents_by_type,
      recent_activity,
    };
  }
}
