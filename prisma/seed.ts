import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cards = [
  {
    name: 'Ace',
    value: 'A',
  },
  {
    name: 'Two',
    value: '2',
  },
  {
    name: 'Three',
    value: '3',
  },
  {
    name: 'Four',
    value: '4',
  },
  {
    name: 'Five',
    value: '5',
  },
  {
    name: 'Six',
    value: '6',
  },
  {
    name: 'Seven',
    value: '7',
  },
  {
    name: 'Eight',
    value: '8',
  },
  {
    name: 'Nine',
    value: '9',
  },
  {
    name: 'Ten',
    value: '10',
  },
  {
    name: 'Jack',
    value: 'J',
  },
  {
    name: 'Queen',
    value: 'Q',
  },
  {
    name: 'King',
    value: 'K',
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
    await prisma.card.createMany({
      data: cards.map((card) => ({
        name: card.name,
        value: card.value,
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
