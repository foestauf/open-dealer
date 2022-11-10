import { TestingModule, Test } from '@nestjs/testing';
import { databaseFixture, testDatabase } from '../../fixtures/database';
import { PrismaService } from '../../prisma.service';
import { DeckController } from '../deck.controller';
import { DeckService } from '../deck.service';

describe('DeckController', () => {
  let controller: DeckController;
  let service: DeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeckController],
      providers: [
        DeckService,
        {
          provide: PrismaService,
          useValue: testDatabase,
        },
      ],
    }).compile();

    controller = module.get<DeckController>(DeckController);
    service = module.get<DeckService>(DeckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have service defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDeck', () => {
    it('should create a deck', async () => {
      const deck = await controller.createDeck();
      expect(deck).toBeDefined();
      expect(deck.cards).toHaveLength(52);
    });
  });

  describe('getDecks', () => {
    it('should return a list of decks', async () => {
      const decks = await controller.getDecks();
      expect(decks).toEqual(databaseFixture.decks);
    });
  });

  //   describe('getDeckById', () => {
  //     it('should return a deck by id', async () => {
  //       const deck = await controller.getDeckById('1');
  //       expect(deck).toEqual(databaseFixture.decks[0]);
  //     });
  //   });
});
