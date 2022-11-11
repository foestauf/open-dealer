import { IsNotEmptyObject, IsNumber, IsString } from 'class-validator';

export class CreateTableDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  numberOfSeats: number;

  @IsNotEmptyObject()
  config: {
    minBet: number;
    maxBet: number;
    minPlayers: number;
    maxPlayers: number;
  };
}
