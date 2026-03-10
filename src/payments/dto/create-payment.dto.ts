import { IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  document_id: string;
}
