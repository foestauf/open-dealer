import { IsNotEmpty, IsString } from 'class-validator';

export class SeatPlayerDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;
}
