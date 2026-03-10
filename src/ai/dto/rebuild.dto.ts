import { IsString, IsNotEmpty } from 'class-validator';

export class RebuildDto {
  @IsString()
  @IsNotEmpty()
  file_url: string;
}
