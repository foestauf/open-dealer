import { pullShoeCards, ShoeArg } from '../pullShoeCards';

describe('pullShoeCards', () => {
  const shoe = {
    decks: [
      {
        id: '1',
        cards: [
          {
            id: '1',
            value: 1,
          },
          {
            id: '2',
            value: 2,
          },
        ],
      },
      {
        id: '2',
        cards: [
          {
            id: '3',
            value: 3,
          },
          {
            id: '4',
            value: 4,
          },
        ],
      },
    ],
  } as unknown as ShoeArg;

  it('should return an array of cards and a map of decks to cards', () => {
    const count = 2;
    const { cardsToPull, deckMap } = pullShoeCards(shoe, count);
    expect(cardsToPull).toHaveLength(count);
    expect(deckMap).toBeInstanceOf(Map);
  });

  it('should throw an error if there are not enough cards in the shoe', () => {
    const count = 5;
    expect(() => pullShoeCards(shoe, count)).toThrow();
  });
});
