import { Controller, Get, Param, Post } from '@nestjs/common';
import { DeckService } from './deck.service';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Post()
  async createDeck() {
    return this.deckService.createDeck();
  }

  @Get()
  async getDecks() {
    return this.deckService.getDecks({});
  }

  @Get(':id')
  async getDeckById(@Param('id') id: string) {
    return this.deckService.getDecks({
      where: {
        id,
      },
      include: {
        cards: true,
      },
    });
  }

  @Post(':id/deal/:count')
  async dealCards(@Param('id') id: string, @Param('count') count: number) {
    return this.deckService.dealCards(id, count);
  }

  //Reset Deck
  @Post(':id/reset')
  async resetDeck(@Param('id') id: string) {
    return this.deckService.resetDeck(id);
  }
}
