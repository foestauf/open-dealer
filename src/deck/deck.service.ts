import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { sampleSize } from 'lodash';

@Injectable()
export class DeckService {
  constructor(private prisma: PrismaService) {}

  async createDeck() {
    const cards = await this.prisma.card.findMany();
    return this.prisma.deck.create({
      data: {
        cards: {
          connect: cards.map((card) => ({
            id: card.id,
          })),
        },
      },
      include: {
        cards: true,
      },
    });
  }

  async getDecks(query: Prisma.DeckFindManyArgs) {
    return this.prisma.deck.findMany(query);
  }

  async dealCards(deckId: string, count: number) {
    return this.prisma.$transaction(async (tx) => {
      const deck = await tx.deck.findUnique({
        where: { id: deckId },
        include: { cards: true },
      });
      const deckSize = deck.cards.length;
      if (deckSize < count) {
        throw new HttpException(
          'Not enough cards in deck',
          HttpStatus.FORBIDDEN,
        );
      }
      const cardsToPull = sampleSize(deck.cards, count);
      await tx.deck.update({
        where: { id: deckId },
        data: {
          cards: {
            disconnect: cardsToPull.map((card) => ({ id: card.id })),
          },
        },
        include: {
          cards: true,
        },
      });
      return cardsToPull;
    });
  }

  async resetDeck(deckId: string) {
    const cards = await this.prisma.card.findMany();
    return await this.prisma.$transaction(async (tx) => {
      await tx.deck.update({
        where: { id: deckId },
        data: {
          cards: {
            set: [],
          },
        },
      });
      return await tx.deck.update({
        where: { id: deckId },
        data: {
          cards: {
            connect: cards.map((card) => ({
              id: card.id,
            })),
          },
        },
        include: {
          cards: true,
        },
      });
    });
  }
}
