import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ContractType } from '../../../generated/prisma/client.js';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsEnum(ContractType)
  contract_type: ContractType;

  @IsString()
  @IsOptional()
  template_html?: string;

  @IsObject()
  @IsOptional()
  template_schema?: Record<string, any>;
}
