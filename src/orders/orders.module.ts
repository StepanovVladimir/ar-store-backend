import { Module } from '@nestjs/common';
import { OrdersInterface } from 'src/orders/orders.interface';
import { OrdersService } from './orders.service';

@Module({
  providers: [{ provide: OrdersInterface, useClass: OrdersService }]
})
export class OrdersModule {}
