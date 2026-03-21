import { OnModuleInit, Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });

    const client: PrismaClient = super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    }) as unknown as PrismaClient;

    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const start = Date.now();
            const result = await query(args);
            const duration = Date.now() - start;
            console.log(`[DB] ${model}.${operation} took ${duration}ms`);
            return result;
          },
        },
      },
    }) as unknown as PrismaService;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
