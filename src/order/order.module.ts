import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderRepository from './infrastructure/order.repository';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import CreateOrderService from './domain/use-case/create-order.service';
import orderPaidService from './domain/use-case/PayOrder.service';
import {DeliveryService} from './domain/use-case/DeliveryService.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },

    CreateOrderService,
    orderPaidService,
    DeliveryService,
  ],
})
export class OrderModule {}
