import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { PrismaService } from '../prisma.service';
import { TableController } from './table.controller';
import { ShoeModule } from '../shoe/shoe.module';
@Module({
  imports: [ShoeModule],
  controllers: [TableController],
  providers: [TableService, PrismaService],
})
export class TableModule {}
