import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';

@Module({
  controllers: [DeckController],
  providers: [PrismaService, DeckService],
  exports: [DeckService],
})
export class DeckModule {}
