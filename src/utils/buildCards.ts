export const cardSeed = [
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

export enum Suit {
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
  HEARTS = 'HEARTS',
  SPADES = 'SPADES',
}

const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

export const buildCardDeck = () => {
  const cards = [];

  suits.forEach((suit) => {
    const suitEnum = Suit[suit.toUpperCase() as keyof typeof Suit];
    cardSeed.forEach((card) => {
      cards.push({
        ...card,
        suit,
        value: card.value,
      });
    });
  });

  return cards;
};
