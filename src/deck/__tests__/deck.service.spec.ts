import { Test, TestingModule } from '@nestjs/testing';
import { DeckService } from '../deck.service';
import { PrismaService } from '../../prisma.service';
import { databaseFixture, testDatabase } from '../../fixtures/database';

describe('DeckService', () => {
  let service: DeckService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckService,
        {
          provide: PrismaService,
          useValue: testDatabase,
        },
      ],
    }).compile();

    service = module.get<DeckService>(DeckService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should have prisma defined', () => {
    expect(prisma).toBeDefined();
  });

  describe('createDeck', () => {
    it('should create a deck', async () => {
      const deck = await service.createDeck();
      expect(deck).toBeDefined();
      expect(deck.cards).toHaveLength(52);
    });
  });

  describe('getDecks', () => {
    it('should return a list of decks', async () => {
      const decks = await service.getDecks({});
      expect(decks).toEqual(databaseFixture.decks);
    });
  });

  describe('dealCards', () => {
    it('should deal cards from a deck', async () => {
      const deck = await service.createDeck();
      const cards = await service.dealCards(deck.id, 5);
      expect(cards).toEqual(databaseFixture.decks[0]);
    });
  });

  describe('resetDeck', () => {
    it('should reset a deck', async () => {
      const deck = await service.createDeck();
      await service.dealCards(deck.id, 5);
      const resetDeck = await service.resetDeck(deck.id);
      expect(resetDeck.cards).toHaveLength(52);
    });
  });
});
