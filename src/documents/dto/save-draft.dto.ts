import { IsObject } from 'class-validator';

export class SaveDraftDto {
  @IsObject()
  data: Record<string, any>;
}
