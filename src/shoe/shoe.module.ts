import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DeckService } from '../deck/deck.service';
import { ShoeController } from './shoe.controller';
import { ShoeService } from './shoe.service';

@Module({
  controllers: [ShoeController],
  providers: [PrismaService, DeckService, ShoeService],
  exports: [ShoeService],
})
export class ShoeModule {}
