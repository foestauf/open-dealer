import { Body, Controller, Param, Post } from '@nestjs/common';
import { ShoeService } from './shoe.service';

@Controller('shoes')
export class ShoeController {
  constructor(private readonly shoeService: ShoeService) {}

  @Post()
  async createShoe(@Body('numberOfDecks') numberOfDecks: number) {
    return this.shoeService.createShoe(numberOfDecks);
  }

  @Post(':id/deal')
  async dealCards(@Body('count') count: number, @Param(':id') shoeId: string) {
    return this.shoeService.dealCards(shoeId, count);
  }
}
