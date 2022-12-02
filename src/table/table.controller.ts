import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TableService } from './table.service';
import { UpdateTableDto } from './dto/update-table';
import { SeatPlayerDto } from './dto/seat-player';

@Controller('tables')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  async createTable(@Body() data) {
    return await this.tableService.createTable(data);
  }

  @Get()
  async getTables() {
    return await this.tableService.getTables();
  }

  @Get(':id')
  async getTable(@Param('id') id: string) {
    return await this.tableService.getTable(id);
  }

  @Patch(':id')
  async updateTable(id: string, @Body() data: UpdateTableDto) {
    return await this.tableService.updateTable(id, data);
  }

  @Patch(':tableId/seats/:seatId')
  async updateSeat(@Param('seatId') seatId: string, @Body() data) {
    return await this.tableService.updateSeat(seatId, data);
  }

  @Post(':tableId/seats')
  async seatPlayer(
    @Param('tableId') tableId: string,
    @Body() body: SeatPlayerDto,
  ) {
    return await this.tableService.seatPlayer(tableId, body.externalId);
  }

  @Post(':tableId/deal')
  async deal(@Param('tableId') tableId: string, @Body() data) {
    return await this.tableService.deal(tableId, data);
  }

  @Post(':tableId/endRound')
  async endHand(@Param('tableId') tableId: string) {
    return this.tableService.endRound(tableId);
  }
}
