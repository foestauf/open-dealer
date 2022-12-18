import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckModule } from './deck/deck.module';
import { ShoeModule } from './shoe/shoe.module';
import { TableModule } from './table/table.module';
import { DBHealthIndicator } from './db.health';
import { PrismaService } from './prisma.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [DeckModule, ShoeModule, TableModule, TerminusModule],
  controllers: [AppController],
  providers: [AppService, DBHealthIndicator, PrismaService],
})
export class AppModule {}
