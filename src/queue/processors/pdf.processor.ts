import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('pdf')
export class PdfProcessor extends WorkerHost {
  private readonly logger = new Logger(PdfProcessor.name);

  process(job: Job): void {
    this.logger.log(
      `Processing PDF job ${job.id} with data: ${JSON.stringify(job.data)}`,
    );
    // Mock processing
    this.logger.log(`PDF job ${job.id} completed`);
  }
}
