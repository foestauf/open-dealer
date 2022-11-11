export class CreateTableDto {
  name: string;
  description: string;
  numberOfSeats: number;
  config: {
    minBet: number;
    maxBet: number;
    minPlayers: number;
    maxPlayers: number;
  };
}
