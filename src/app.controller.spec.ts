import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { HealthCheckService } from '@nestjs/terminus';
import { DBHealthIndicator } from './db.health';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
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
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockResolvedValue({}),
          },
        },
        DBHealthIndicator,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
