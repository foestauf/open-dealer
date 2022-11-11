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
    return await this.prisma.table.create({
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
  }

  async getTable(id: string) {
    return await this.prisma.table.findUnique({
      where: { id },
      include: {
        Seat: true,
        TableConfig: true,
        Shoe: { include: { _count: { select: { decks: true } } } },
      },
    });
  }

  async getTables() {
    return await this.prisma.table.findMany({
      include: {
        Seat: true,
        TableConfig: true,
        Shoe: { include: { _count: { select: { decks: true } } } },
      },
    });
  }

  async updateTable(id: string, data: UpdateTableDto) {
    return await this.prisma.table.update({ where: { id }, data });
  }

  async updateSeat(seatId: string, data: UpdateSeatDto) {
    return await this.prisma.seat.update({
      where: {
        id: seatId,
      },
      data,
    });
  }

  async deal(tableId: string, data: DealSeatDto) {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
      include: {
        Seat: true,
        Shoe: true,
      },
    });
    // get seat from table response
    const initialSeat = table.Seat.find(
      (seat) => seat.seatNumber === data.seat,
    );

    const cardsDealt = await this.shoeService.dealCards(
      table.Shoe.id,
      data.numberOfCards,
    );
    const cardCodes = cardsDealt.map((card) => card.short);
    const hand = initialSeat.hand;
    const seat = await this.prisma.seat.update({
      where: {
        id: initialSeat.id,
      },
      data: {
        hand: hand.concat(cardCodes),
      },
    });
    return seat;
  }

  async endHand(tableId: string) {
    await this.prisma.seat.updateMany({
      where: {
        tableId,
      },
      data: {
        hand: [],
        bet: 0,
      },
    });
    return this.prisma.table.findUnique({
      where: { id: tableId },
      include: { Seat: true },
    });
  }
}
