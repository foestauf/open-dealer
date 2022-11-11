import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateTableDto } from '../create-table';

describe('createTableDto', () => {
  it('should not throw an error if all properties are valid', async () => {
    const dto = plainToInstance(CreateTableDto, {
      name: 'test',
      description: 'test',
      numberOfSeats: 1,
      config: {
        minBet: 1,
        maxBet: 1,
        minPlayers: 1,
        maxPlayers: 1,
      },
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
  it('should throw an error if name is not a string', async () => {
    const createTableInfo = {
      description: 'test',
      numberOfSeats: 6,
      config: {
        minBet: 10,
        maxBet: 100,
        minPlayers: 2,
        maxPlayers: 6,
      },
    };
    const createTableDto = plainToInstance(CreateTableDto, createTableInfo);
    const errors = await validate(createTableDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('name');
  });

  it('should throw an error if description is not a string', async () => {
    const createTableInfo = {
      name: 'test',
      numberOfSeats: 6,
      config: {
        minBet: 10,
        maxBet: 100,
        minPlayers: 2,
        maxPlayers: 6,
      },
    };
    const createTableDto = plainToInstance(CreateTableDto, createTableInfo);
    const errors = await validate(createTableDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('description');
  });

  it('should throw an error if numberOfSeats is not a number', async () => {
    const createTableInfo = {
      name: 'test',
      description: 'test',
      config: {
        minBet: 10,
        maxBet: 100,
        minPlayers: 2,
        maxPlayers: 6,
      },
    };
    const createTableDto = plainToInstance(CreateTableDto, createTableInfo);
    const errors = await validate(createTableDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('numberOfSeats');
  });

  it('should throw an error if config is not an object', async () => {
    const createTableInfo = {
      name: 'test',
      description: 'test',
      numberOfSeats: 6,
    };
    const createTableDto = plainToInstance(CreateTableDto, createTableInfo);
    const errors = await validate(createTableDto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('config');
  });
});
