import { TestingModule, Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue({}),
            card: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!');
  });

  it('should seed the database', async () => {
    const spy = jest.spyOn(service, 'seedDatabase');
    await service.onModuleInit();
    expect(spy).toHaveBeenCalled();
  });
});
