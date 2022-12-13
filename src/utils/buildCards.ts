import { cardsFixture } from '../fixtures/cards';
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
    cardsFixture.forEach((card) => {
      cards.push({
        ...card,
        suit,
        value: card.value,
      });
    });
  });

  return cards;
};
