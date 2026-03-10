import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('ai') private readonly aiQueue: Queue,
    @InjectQueue('pdf') private readonly pdfQueue: Queue,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async addAiJob(data: Record<string, any>) {
    return this.aiQueue.add('ai-job', data);
  }

  async addPdfJob(data: Record<string, any>) {
    return this.pdfQueue.add('pdf-job', data);
  }

  async addEmailJob(data: Record<string, any>) {
    return this.emailQueue.add('email-job', data);
  }
}
