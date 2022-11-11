import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DealSeatDto } from '../deal-seat';

describe('deal-seat dto', () => {
  it('should be defined', () => {
    expect(new DealSeatDto()).toBeDefined();
  });

  it('should throw an error if seat is not a number', async () => {
    const dealSeatInfo = {
      numberOfCards: 1,
    };
    const dealSeatDto = plainToInstance(DealSeatDto, dealSeatInfo);
    const errors = await validate(dealSeatDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('seat');
  });

  it('should throw an error if numberOfCards is not a number', async () => {
    const dealSeatInfo = {
      seat: 1,
    };
    const dealSeatDto = plainToInstance(DealSeatDto, dealSeatInfo);
    const errors = await validate(dealSeatDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('numberOfCards');
  });

  it('should not throw an error if all properties are valid', async () => {
    const dealSeatInfo = {
      seat: 1,
      numberOfCards: 1,
    };
    const dealSeatDto = plainToInstance(DealSeatDto, dealSeatInfo);
    const errors = await validate(dealSeatDto);
    expect(errors.length).toBe(0);
  });
});
