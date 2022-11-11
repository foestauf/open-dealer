import { IsNumber } from 'class-validator';

export class UpdateSeatDto {
  @IsNumber()
  bet?: number;

  @IsNumber()
  hand?: string;

  @IsNumber()
  externalId?: string;
}
