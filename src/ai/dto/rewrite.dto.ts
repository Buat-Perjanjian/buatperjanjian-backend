import { IsString, IsNotEmpty } from 'class-validator';

export class RewriteDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
