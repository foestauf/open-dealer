import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { ShoeService } from '../../shoe/shoe.service';
import { TableService } from '../table.service';
import { table } from '../../fixtures/table';

describe('TableService', () => {
  let service: TableService;
  let prisma: PrismaService;
  let shoeService: ShoeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        {
          provide: PrismaService,
          useValue: {
            table: {
              create: jest.fn().mockResolvedValue(table),
              findMany: jest.fn(),
              findUnique: jest.fn().mockResolvedValue(table),
              update: jest.fn().mockResolvedValue(table),
              delete: jest.fn(),
            },
            seat: {
              updateMany: jest.fn(),
              create: jest.fn(),
            },
            shoe: {
              create: jest.fn().mockResolvedValue({ id: '1' }),
            },
          },
        },
        {
          provide: ShoeService,
          useValue: {
            createShoe: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    prisma = module.get<PrismaService>(PrismaService);
    shoeService = module.get<ShoeService>(ShoeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateTable', () => {
    it('should update a table', async () => {
      const updateTableDto = {
        name: 'Table 1',
        description: 'Table 1',
        config: {
          minBet: 5,
          maxBet: 500,
          minPlayers: 1,
          maxPlayers: 6,
        },
      };

      const result = await service.updateTable('1', updateTableDto);

      expect(result).toEqual(table);
      expect(prisma.table.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          name: 'Table 1',
          description: 'Table 1',
          config: {
            minBet: 5,
            maxBet: 500,
            minPlayers: 1,
            maxPlayers: 6,
          },
        },
      });
    });
  });

  describe('getTable', () => {
    it('should get a table', async () => {
      const result = await service.getTable('1');

      expect(result).toEqual(table);
      expect(prisma.table.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        include: {
          Seat: true,
          TableConfig: true,
          Shoe: { include: { _count: { select: { decks: true } } } },
        },
      });
    });
  });

  describe('deleteTable', () => {
    it('should delete a table', async () => {
      const table = await service.createTable({
        name: 'Table 1',
        description: 'Table 1',
        numberOfSeats: 6,
        config: {
          minBet: 5,
          maxBet: 500,
          minPlayers: 1,
          maxPlayers: 6,
        },
      });
      await service.deleteTable(table.id);

      expect(prisma.table.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });
});
