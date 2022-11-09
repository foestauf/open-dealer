import { Injectable } from '@nestjs/common';
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
            cards: true,
          },
        },
      },
    });
  }

  async dealCards(shoeId: string, count: number) {
    return this.prisma.$transaction(async (tx) => {
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
      // Get sample size of cards
      const cardsToPull = sampleSize(cards, count);
      // Iterate each deck and remove the cards that were pulled from that deck
      await Promise.all(
        shoe.decks.map(async (deck) => {
          const cardsInDeck = cardsToPull.filter((card) =>
            deck.cards.some((c) => c.id === card.id),
          );
          await tx.deck.update({
            where: { id: deck.id },
            data: {
              cards: {
                disconnect: cardsInDeck.map((card) => ({ id: card.id })),
              },
            },
            include: {
              cards: true,
            },
          });
        }),
      );
      return cardsToPull;
    });
  }
}
