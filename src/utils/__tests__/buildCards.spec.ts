import { buildCardDeck } from '../buildCards';

describe('buildCards', () => {
  it('should return an array of cards', () => {
    const cards = buildCardDeck();
    expect(cards).toBeInstanceOf(Array);
  });

  it('should return an array of 52 cards', () => {
    const cards = buildCardDeck();
    expect(cards).toHaveLength(52);
  });
});
