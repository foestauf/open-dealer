import { IsNotEmpty, IsNumber } from 'class-validator';

export class DealSeatDto {
  @IsNumber()
  @IsNotEmpty()
  seat: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfCards: number;
}
