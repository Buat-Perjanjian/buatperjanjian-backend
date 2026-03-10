import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AnalyzeDto {
  @IsOptional()
  @IsString()
  file_url?: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}
