import { HttpException, HttpStatus } from '@nestjs/common';
import { Card, Deck, Shoe } from '@prisma/client';
import { sampleSize } from 'lodash';

export type ShoeArg = Shoe & {
  decks: (Deck & {
    cards: Card[];
  })[];
};

export const pullShoeCards = (shoe: ShoeArg, count: number) => {
  const cardsToPull: Card[] = [];
  const deckMap = new Map();

  // combine all the cards in the shoe
  const cards: Card[] = shoe.decks.reduce(
    (acc, deck) => [...acc, ...deck.cards],
    [],
  );
  // If there are not enough cards in the shoe, throw http exception
  if (cards.length < count) {
    throw new HttpException('Not enough cards in shoe', HttpStatus.FORBIDDEN);
  }

  // For loop to find random cards to pull from decks
  for (let i = 0; i < count; i++) {
    // Get decks with at least one card
    const decksWithCards = shoe.decks.filter((deck) => deck.cards.length > 0);
    const randomDeck = sampleSize(decksWithCards, 1)[0];
    const randomCard = sampleSize(randomDeck.cards, 1)[0];
    cardsToPull.push(randomCard);
    if (deckMap.has(randomDeck.id)) {
      deckMap.get(randomDeck.id).push(randomCard);
    } else {
      deckMap.set(randomDeck.id, [randomCard]);
    }
  }
  return { cardsToPull, deckMap };
};
