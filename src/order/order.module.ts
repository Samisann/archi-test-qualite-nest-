import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderRepository from './infrastructure/order.repository';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from './domain/use-case/create-order.service';
import { PayOrderService } from './domain/use-case/pay-order.service';
import { SetShippingAddressOrderService } from './domain/use-case/set-shipping-adress-order.service';
import { SetInvoiceAddressOrderService } from './domain/use-case/set-invoice-adress.service';
import { CancelOrderService } from './domain/use-case/cancel-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },

    CreateOrderService,
    PayOrderService,
    SetShippingAddressOrderService,
    SetInvoiceAddressOrderService,
    CancelOrderService
  ],
})
export class OrderModule {}
