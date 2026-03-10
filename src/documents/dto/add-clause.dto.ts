import { IsUUID } from 'class-validator';

export class AddClauseDto {
  @IsUUID()
  clause_id: string;
}
