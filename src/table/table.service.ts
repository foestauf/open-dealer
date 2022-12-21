import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTableDto } from './dto/create-table';
import { UpdateTableDto } from './dto/update-table';
import { UpdateSeatDto } from './dto/update-seat';
import { ShoeService } from '../shoe/shoe.service';
import { DealSeatDto } from './dto/deal-seat';

@Injectable()
export class TableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shoeService: ShoeService,
  ) {}

  async createTable(data: CreateTableDto) {
    // Create Shoe ahead of time
    const shoe = await this.shoeService.createShoe(8);
    const newTable = await this.prisma.table.create({
      data: {
        name: data.name,
        description: data.description,
        Shoe: {
          connect: {
            id: shoe.id,
          },
        },
        Seat: {
          createMany: {
            data: Array.from({ length: data.numberOfSeats }).map(
              (_, index) => ({
                seatNumber: index + 1,
              }),
            ),
          },
        },
        TableConfig: {
          create: {
            minBet: data.config.minBet,
            maxBet: data.config.maxBet,
            minPlayers: data.config.minPlayers,
            maxPlayers: data.config.maxPlayers,
          },
        },
      },
      include: {
        Seat: true,
        TableConfig: true,
        Shoe: {
          include: {
            _count: {
              select: {
                decks: true,
              },
            },
          },
        },
      },
    });
    // Dealer seat is special and we must add it seperately
    await this.prisma.seat.create({
      data: {
        tableId: newTable.id,
        seatNumber: 0,
        isDealer: true,
      },
    });
    return newTable;
  }

  async getTable(id: string) {
    return this.prisma.table.findUnique({
      where: { id },
      include: {
        Seat: true,
        TableConfig: true,
        Shoe: { include: { _count: { select: { decks: true } } } },
      },
    });
  }

  async getTables() {
    return this.prisma.table.findMany({
      include: {
        Seat: true,
        TableConfig: true,
        Shoe: { include: { _count: { select: { decks: true } } } },
      },
    });
  }

  async updateTable(id: string, data: UpdateTableDto) {
    return this.prisma.table.update({ where: { id }, data });
  }

  async updateSeat(seatId: string, data: UpdateSeatDto) {
    return this.prisma.seat.update({
      where: {
        id: seatId,
      },
      data,
    });
  }

  async seatPlayer(tableId: string, externalId: string) {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
      include: {
        Seat: true,
      },
    });
    const seat = table.Seat.find((seat) => !seat.externalId && !seat.isDealer);
    if (!seat) {
      throw new Error('No seats available');
    }
    return this.prisma.seat.update({
      where: {
        id: seat.id,
      },
      data: {
        externalId,
      },
    });
  }

  async deal(tableId: string, data: DealSeatDto) {
    let initialSeat;
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
      include: {
        Seat: true,
        Shoe: true,
      },
    });
    if (data.seat === 'dealer') {
      initialSeat = table.Seat.find((seat) => seat.isDealer);
      if (!initialSeat) {
        throw new Error('No dealer seat');
      }
    } else {
      // get seat from table response
      initialSeat = table.Seat.find((seat) => seat.seatNumber === data.seat);
    }

    const cardsDealt = await this.shoeService.dealCards(
      table.Shoe.id,
      data.numberOfCards,
    );
    const hand = initialSeat.hand;
    await this.prisma.seat.update({
      where: {
        id: initialSeat.id,
      },
      data: {
        hand: hand.concat(cardsDealt),
      },
    });
    return cardsDealt;
  }

  async endRound(tableId: string) {
    await this.prisma.seat.updateMany({
      where: {
        tableId,
      },
      data: {
        hand: { set: [] },
        bet: 0,
      },
    });
    return this.prisma.table.findUnique({
      where: { id: tableId },
      include: { Seat: true },
    });
  }

  async deleteTable(id: string) {
    return this.prisma.table.delete({ where: { id } });
  }
}
