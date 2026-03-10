import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing email job ${job.id} with data: ${JSON.stringify(job.data)}`);
    // Mock processing
    this.logger.log(`Email job ${job.id} completed`);
  }
}
