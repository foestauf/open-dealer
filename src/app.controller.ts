import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { AppService } from './app.service';
import { DBHealthIndicator } from './db.health';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private readonly DBHealthIndicator: DBHealthIndicator,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HealthCheck()
  async getHealth() {
    return this.health.check([
      () => this.DBHealthIndicator.isHealthy('database'),
    ]);
  }
}
