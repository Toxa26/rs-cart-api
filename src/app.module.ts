import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { PostgresModule } from 'nest-postgres';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

@Module({
  imports: [
    PostgresModule.forRootAsync(
      {
        useFactory: () => ({
          host: PG_HOST,
          database: PG_DATABASE,
          password: PG_PASSWORD,
          user: PG_USERNAME,
          port: Number(PG_PORT),
          connectionTimeoutMillis: 5000,
        }),
      },
      'dbConnection',
    ),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
