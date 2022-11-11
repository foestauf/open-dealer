import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Card } from '@prisma/client';
import { sampleSize } from 'lodash';
import { PrismaService } from 'src/prisma.service';
import { DeckService } from '../deck/deck.service';

@Injectable()
export class ShoeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deckService: DeckService,
  ) {}

  async createShoe(numberOfDecks: number) {
    const decks = await Promise.all(
      Array.from({ length: numberOfDecks }, () =>
        this.deckService.createDeck(),
      ),
    );
    const shoe = await this.prisma.shoe.create({
      data: {
        decks: {
          connect: decks.map((deck) => ({
            id: deck.id,
          })),
        },
      },
      include: {
        decks: {
          include: {
            cards: true,
          },
        },
      },
    });
    return shoe;
  }

  async getShoes() {
    return this.prisma.shoe.findMany();
  }

  async getShoeById(id: string) {
    return this.prisma.shoe.findUnique({
      where: {
        id,
      },
      include: {
        decks: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
            cards: true,
          },
        },
      },
    });
  }

  async dealCards(shoeId: string, count: number) {
    const cardsToPull: Card[] = [];
    return this.prisma.$transaction(async (tx) => {
      const deckMap = new Map();

      const shoe = await tx.shoe.findUnique({
        where: { id: shoeId },
        include: {
          decks: {
            include: {
              cards: true,
            },
          },
        },
      });

      // combine all the cards in the shoe
      const cards: Card[] = shoe.decks.reduce(
        (acc, deck) => [...acc, ...deck.cards],
        [],
      );
      // If there are not enough cards in the shoe, throw http exception
      if (cards.length < count) {
        throw new HttpException(
          'Not enough cards in shoe',
          HttpStatus.FORBIDDEN,
        );
      }

      // For loop to find random cards to pull from decks
      for (let i = 0; i < count; i++) {
        // Get decks with at least one card
        const decksWithCards = shoe.decks.filter(
          (deck) => deck.cards.length > 0,
        );
        const randomDeck = sampleSize(decksWithCards, 1)[0];
        const randomCard = sampleSize(randomDeck.cards, 1)[0];
        cardsToPull.push(randomCard);
        if (deckMap.has(randomDeck.id)) {
          deckMap.get(randomDeck.id).push(randomCard);
        } else {
          deckMap.set(randomDeck.id, [randomCard]);
        }
      }

      // For loop to update the decks in the shoe
      for (const [deckId, cards] of deckMap.entries()) {
        await tx.deck.update({
          where: { id: deckId },
          data: {
            cards: {
              disconnect: cards.map((card) => ({ id: card.id })),
            },
          },
        });
      }

      return cardsToPull;
    });
  }

  async resetShoe(shoeId: string) {
    const decks = await this.prisma.deck.findMany();
    await Promise.all(
      decks.map(async (deck) => this.deckService.resetDeck(deck.id)),
    );
    return this.getShoeById(shoeId);
  }
}
