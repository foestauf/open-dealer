import { cardsFixture } from './cards';
import { buildCardDeck } from '../utils/buildCards';

const cards = buildCardDeck();

export const databaseFixture = {
  decks: [
    {
      id: '1',
      cards,
    },
    {
      id: '2',
      cards,
    },
    {
      id: '3',
      cards,
    },
  ],
  cards,
  shoes: [
    {
      id: '1',
      decks: [
        {
          id: '1',
          cards,
        },
        {
          id: '2',
          cards,
        },
        {
          id: '3',
          cards,
        },
      ],
    },
  ],
};

export const testDatabase = {
  card: {
    create: jest.fn().mockResolvedValue(cardsFixture[0]),
    findMany: jest.fn().mockResolvedValue(buildCardDeck()),
    findUnique: jest.fn().mockResolvedValue(cardsFixture[0]),
    update: jest.fn().mockResolvedValue(cardsFixture[0]),
    delete: jest.fn().mockResolvedValue(cardsFixture[0]),
    upsert: jest.fn().mockResolvedValue(cardsFixture[0]),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    count: jest.fn().mockResolvedValue(1),
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
  deck: {
    create: jest.fn().mockResolvedValue(databaseFixture.decks[0]),
    findMany: jest.fn().mockResolvedValue(databaseFixture.decks),
    findUnique: jest.fn().mockResolvedValue(databaseFixture.decks[0]),
    update: jest.fn().mockResolvedValue(databaseFixture.decks[0]),
    delete: jest.fn().mockResolvedValue(databaseFixture.decks[0]),
    upsert: jest.fn().mockResolvedValue(databaseFixture.decks[0]),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    count: jest.fn().mockResolvedValue(1),
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
  shoe: {
    create: jest.fn().mockResolvedValue(databaseFixture.shoes[0]),
    findMany: jest.fn().mockResolvedValue(databaseFixture.shoes),
    findUnique: jest.fn().mockResolvedValue(databaseFixture.shoes[0]),
    update: jest.fn().mockResolvedValue(databaseFixture.shoes[0]),
    delete: jest.fn().mockResolvedValue(databaseFixture.shoes[0]),
    upsert: jest.fn().mockResolvedValue(databaseFixture.shoes[0]),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    count: jest.fn().mockResolvedValue(1),
    createMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
  $transaction: jest.fn().mockResolvedValue(databaseFixture.decks[0]),
};
