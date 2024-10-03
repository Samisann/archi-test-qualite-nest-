import { CreateOrderService } from 'src/order/application/use-case/create-order.service';
import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';
import OrderRepositoryTypeOrm from 'src/order/infrastructure/bdd/order.repository';
import { PayOrderService } from 'src/order/application/use-case/pay-order.service';
import { CancelOrderService } from 'src/order/application/use-case/cancel-order.service';

import OrderController from 'src/order/infrastructure/presentation/order.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderItem } from 'src/order/domain/entity/order-item.entity';
import { SetShippingAddressOrderService } from './application/use-case/set-shipping-adress-order.service';
import { SetInvoiceAddressOrderService } from './application/use-case/set-invoice-adress.service';
import { GenerateOrderPdfService } from './application/use-case/generate-invoice-pdf.service';
import { pdfGenerator } from './infrastructure/generate-pdf';
import { generatePdfInterface } from './domain/port/generate-invoice-pdf.interface';
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],

  providers: [
    // j'enregistre mon repository en tant que service
    OrderRepositoryTypeOrm,
    // j'enregistre le service directement (pas besoin de faire de useFactory)
    // pour celui là car il injecte directement le OrderRepositoryTypeOrm)
    PayOrderService,
    CancelOrderService,
    SetInvoiceAddressOrderService,
    SetShippingAddressOrderService,
    GenerateOrderPdfService,
    // pour pouvoir gérer l'inversion de dépendance
    // du service CreateOrderService
    // j'utilise le système de useFactory de nest
    {
      // quand j'enregistre la classe CreateOrderService
      provide: CreateOrderService,
      // je demande à Nest Js de créer une instance de cette classe
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CreateOrderService(orderRepository);
      },
      // en lui injectant une instance de OrderRepositoryTypeOrm
      // à la place de l'interface qui est utilisée dans le constructeur de CreateOrderService
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: CancelOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CancelOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: SetInvoiceAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new SetInvoiceAddressOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: SetShippingAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new SetShippingAddressOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: PayOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new PayOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },

    {
      provide: GenerateOrderPdfService,
      useFactory: (
        orderRepository: OrderRepositoryInterface,
        pdfGenerator: generatePdfInterface,
      ) => {
        return new GenerateOrderPdfService(orderRepository, pdfGenerator);
      },
      inject: [OrderRepositoryTypeOrm, pdfGenerator],
    },
  ],
})
export class OrderModule {}
