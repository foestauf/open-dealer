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
        TableService,
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
});
