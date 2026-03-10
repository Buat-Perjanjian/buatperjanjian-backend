import { IsString, IsNotEmpty } from 'class-validator';

export class ExplainDto {
  @IsString()
  @IsNotEmpty()
  question: string;
}
