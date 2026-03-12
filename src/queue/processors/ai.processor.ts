import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('ai')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);

  process(job: Job): void {
    this.logger.log(
      `Processing AI job ${job.id} with data: ${JSON.stringify(job.data)}`,
    );
    // Mock processing
    this.logger.log(`AI job ${job.id} completed`);
  }
}
