export class UpdateTableDto {
  name: string;
  description: string;
  config: {
    minBet: number;
    maxBet: number;
    minPlayers: number;
    maxPlayers: number;
  };
}
