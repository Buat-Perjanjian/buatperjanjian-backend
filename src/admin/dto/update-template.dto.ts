import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ContractType } from '../../../generated/prisma/client.js';

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ContractType)
  @IsOptional()
  contract_type?: ContractType;

  @IsString()
  @IsOptional()
  template_html?: string;

  @IsObject()
  @IsOptional()
  template_schema?: Record<string, any>;
}
