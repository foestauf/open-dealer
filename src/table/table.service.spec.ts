import { TestingModule, Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ShoeService } from '../shoe/shoe.service';
import { TableService } from './table.service';

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
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            seat: {
              updateMany: jest.fn(),
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

    service = module.get<TableService>(TableService);
    prisma = module.get<PrismaService>(PrismaService);
    shoeService = module.get<ShoeService>(ShoeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
