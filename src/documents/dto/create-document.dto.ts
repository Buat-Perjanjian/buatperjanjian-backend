import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ContractType } from '@prisma/client';

export class CreateDocumentDto {
  @IsUUID()
  company_id: string;

  @IsEnum(ContractType)
  contract_type: ContractType;

  @IsString()
  @IsOptional()
  title?: string;
}
