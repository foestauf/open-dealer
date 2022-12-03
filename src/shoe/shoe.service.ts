import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DeckService } from '../deck/deck.service';
import { pullShoeCards } from '../utils/pullShoeCards';

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

      if (!shoe) {
        throw new HttpException('Shoe not found', HttpStatus.NOT_FOUND);
      }
      const { deckMap, cardsToPull } = pullShoeCards(shoe, count);

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
