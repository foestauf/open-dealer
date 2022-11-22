import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SeatPlayerDto } from '../seat-player';

describe('seat-player dto', () => {
  it('should be defined', () => {
    expect(new SeatPlayerDto()).toBeDefined();
  });

  it('should throw an error if externalId is not a string', async () => {
    const seatPlayerInfo = {
      externalId: 1,
    };
    const seatPlayerDto = plainToInstance(SeatPlayerDto, seatPlayerInfo);
    const errors = await validate(seatPlayerDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('externalId');
  });

  it('should not throw an error if externalId is a string', async () => {
    const seatPlayerInfo = {
      externalId: '1',
    };
    const seatPlayerDto = plainToInstance(SeatPlayerDto, seatPlayerInfo);
    const errors = await validate(seatPlayerDto);
    expect(errors.length).toBe(0);
  });
});
