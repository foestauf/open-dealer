import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShoeService } from './shoe.service';

@Controller('shoes')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @Post()
  async createShoe(@Body('numberOfDecks') numberOfDecks: number) {
    return this.shoeService.createShoe(numberOfDecks);
  }

  @Get(':id')
  async getShoeById(@Param('id') id: string) {
    return this.shoeService.getShoeById(id);
  }

  @Post(':id/deal')
  async dealCards(@Body('count') count: number, @Param('id') shoeId: string) {
    return this.shoeService.dealCards(shoeId, count);
  }

  @Post(':id/reset')
  async resetShoe(@Param('id') id: string) {
    return this.shoeService.resetShoe(id);
  }
}
