import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckModule } from './deck/deck.module';
import { ShoeModule } from './shoe/shoe.module';

@Module({
  imports: [DeckModule, ShoeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
