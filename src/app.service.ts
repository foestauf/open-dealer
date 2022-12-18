import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import seeder from '../prisma/seed';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    console.log('AppService initialized');
    // Check if cards exist, if not seed the database
    const cards = await this.prisma.card.findMany();
    if (cards.length === 0) {
      await this.seedDatabase();
    }
  }

  async seedDatabase() {
    console.log('Seeding database');
    await seeder();
  }
}
