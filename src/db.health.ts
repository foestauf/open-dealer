import { Injectable, HttpException } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

@Injectable()
export class DBHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string) {
    const query = await this.prisma.$queryRaw`SELECT 1`;
    const isHealthy = !!query;
    const result = this.getStatus(key, isHealthy, {
      message: isHealthy ? 'OK' : 'Database is not healthy',
    });
    if (!isHealthy) {
      throw new HttpException(result, 500);
    }
    return result;
  }
}
