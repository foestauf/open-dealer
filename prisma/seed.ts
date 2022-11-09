import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cards = [
  {
    name: 'Ace',
    value: 1,
    short: 'A',
  },
  {
    name: 'Two',
    value: 2,
    short: '2',
  },
  {
    name: 'Three',
    value: 3,
    short: '3',
  },
  {
    name: 'Four',
    value: 4,
    short: '4',
  },
  {
    name: 'Five',
    value: 5,
    short: '5',
  },
  {
    name: 'Six',
    value: 6,
    short: '6',
  },
  {
    name: 'Seven',
    value: 7,
    short: '7',
  },
  {
    name: 'Eight',
    value: 8,
    short: '8',
  },
  {
    name: 'Nine',
    value: 9,
    short: '9',
  },
  {
    name: 'Ten',
    value: 10,
    short: '10',
  },
  {
    name: 'Jack',
    value: 10,
    short: 'J',
  },
  {
    name: 'Queen',
    value: 10,
    short: 'Q',
  },
  {
    name: 'King',
    value: 10,
    short: 'K',
  },
];

enum Suit {
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
  HEARTS = 'HEARTS',
  SPADES = 'SPADES',
}

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

async function main() {
  suits.forEach(async (suit) => {
    const suitEnum = Suit[suit.toUpperCase() as keyof typeof Suit];
    const shortSuffix = suitEnum.charAt(0);
    await prisma.card.createMany({
      data: cards.map((card) => ({
        name: card.name,
        value: card.value,
        short: card.short + shortSuffix,
        suit: suitEnum,
      })),
    });
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
