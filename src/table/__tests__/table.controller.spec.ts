import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { TableController } from '../table.controller';
import { TableService } from '../table.service';
import { ShoeService } from '../../shoe/shoe.service';

const db = {
  table: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  seat: {
    updateMany: jest.fn(),
  },
};

describe('TableController', () => {
  let controller: TableController;
  let service: TableService;
  let shoeService: ShoeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableController],
      providers: [
        {
          provide: TableService,
          useValue: {
            createTable: jest.fn(),
            getTables: jest.fn(),
            getTable: jest.fn(),
            updateTable: jest.fn(),
            deleteTable: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: db,
        },
        {
          provide: ShoeService,
          useValue: {
            createShoe: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TableController>(TableController);
    service = module.get<TableService>(TableService);
    shoeService = module.get<ShoeService>(ShoeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have service defined', () => {
    expect(service).toBeDefined();
  });

  it('should have shoeService defined', () => {
    expect(shoeService).toBeDefined();
  });

  describe('createTable', () => {
    it('should call service.createTable', async () => {
      const dto = {
        name: 'Table 1',
        description: 'Table 1',
        config: {
          minBet: 5,
          maxBet: 500,
          maxPlayers: 6,
          seats: [
            {
              position: 1,
              name: 'Seat 1',
              description: 'Seat 1',
            },
            {
              position: 2,
              name: 'Seat 2',
              description: 'Seat 2',
            },
          ],
        },
      };

      await controller.createTable(dto);
      expect(service.createTable).toBeCalledWith(dto);
    });
  });

  describe('getTables', () => {
    it('should call service.getTables', async () => {
      await controller.getTables();
      expect(service.getTables).toBeCalled();
    });
  });

  describe('getTable', () => {
    it('should call service.getTable', async () => {
      await controller.getTable('1');
      expect(service.getTable).toBeCalledWith('1');
    });
  });

  describe('updateTable', () => {
    it('should call service.updateTable', async () => {
      const dto = {
        name: 'Table 1',
        description: 'Table 1',
        config: {
          minBet: 5,
          maxBet: 500,
          minPlayers: 2,
          maxPlayers: 6,
          seats: [
            {
              position: 1,
              name: 'Seat 1',
              description: 'Seat 1',
            },
            {
              position: 2,
              name: 'Seat 2',
              description: 'Seat 2',
            },
          ],
        },
      };

      await controller.updateTable('1', dto);
      expect(service.updateTable).toBeCalledWith('1', dto);
    });
  });

  describe('deleteTable', () => {
    it('should call service.deleteTable', async () => {
      await controller.deleteTable('1');
      expect(service.deleteTable).toBeCalledWith('1');
    });
  });
});
