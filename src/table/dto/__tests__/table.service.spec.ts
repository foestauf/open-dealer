import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { ShoeService } from '../../../shoe/shoe.service';
import { TableService } from '../../../table/table.service';

describe('table service', () => {
  let tableService: TableService;
  let prismaService: PrismaService;
  let shoeService: ShoeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        {
          provide: PrismaService,
          useValue: {
            table: {
              create: jest.fn(),
            },
            seat: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: ShoeService,
          useValue: {
            createShoe: jest.fn(),
          },
        },
      ],
    }).compile();

    tableService = module.get<TableService>(TableService);
    prismaService = module.get<PrismaService>(PrismaService);
    shoeService = module.get<ShoeService>(ShoeService);
  });

  it('should be defined', () => {
    expect(tableService).toBeDefined();
  });

  describe('createTable', () => {
    it('should create a table', async () => {
      const createTableDto = {
        name: 'test table',
        description: 'test table description',
        numberOfSeats: 2,
        config: {
          minBet: 1,
          maxBet: 100,
          minPlayers: 1,
          maxPlayers: 2,
        },
      };

      const shoe = {
        id: 'test-shoe-id',
      };

      const table = {
        id: 'test-table-id',
        name: 'test table',
        description: 'test table description',
        Seat: [
          {
            id: 'test-seat-id-1',
            seatNumber: 1,
          },
          {
            id: 'test-seat-id-2',
            seatNumber: 2,
          },
        ],
        TableConfig: {
          id: 'test-table-config-id',
          minBet: 1,
          maxBet: 100,
          minPlayers: 1,
          maxPlayers: 2,
        },
        Shoe: {
          id: 'test-shoe-id',
          _count: {
            decks: 8,
          },
        },
      };

      (shoeService.createShoe as jest.Mock).mockResolvedValue(shoe);
      (prismaService.table.create as jest.Mock).mockResolvedValue(table);

      const result = await tableService.createTable(createTableDto);

      expect(result).toEqual(table);
      expect(shoeService.createShoe).toHaveBeenCalledWith(8);
    });
  });
});
