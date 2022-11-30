import { IsNotEmpty, IsNumber } from 'class-validator';

export class DealSeatDto {
  @IsNumber()
  @IsNotEmpty()
  seat: number | string;

  @IsNumber()
  @IsNotEmpty()
  numberOfCards: number;
}
