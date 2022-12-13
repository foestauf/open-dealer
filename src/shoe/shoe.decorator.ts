import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShoeSizeInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const shoeId = context.switchToHttp().getRequest().params.shoeId;
    if (!shoeId) return next.handle();
    const prisma = new PrismaService();
    const getShoeSize = async () =>
      await prisma.deck
        .findMany({
          where: {
            shoeId,
          },
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        })
        .then((result) =>
          result.reduce((acc, deck) => acc + deck._count.cards, 0),
        );

    return next.handle().pipe(
      map(async (data) => {
        const shoeSize = await getShoeSize();
        context.switchToHttp().getResponse().setHeader('X-Shoe-Size', shoeSize);

        return data;
      }),
    );
  }
}

export function ShoeSizeDecorator() {
  return applyDecorators(UseInterceptors(ShoeSizeInterceptor));
}
