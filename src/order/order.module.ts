import { CreateOrderService } from 'src/order/application/use-case/create-order.service';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
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
import { GenerateInvoiceService } from './application/use-case/generate-invoice-pdf.service';
import { PdfGeneratorService } from './infrastructure/pdf/generate-pdf.service';
import { PdfGeneratorServiceInterface } from './domain/port/pdf/generate-invoice-pdf.service.interface';
import { EmailService } from 'src/product/infrastructure/presentation/email.service';
import { EmailServiceInterface } from 'src/product/domain/port/persistance/email-service.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product-repository.interface';
import { ProductRepositoryImpl } from 'src/product/infrastructure/bdd/product-repository';
import { DiscountRepositoryImpl } from 'src/product/infrastructure/bdd/discount-repository';
import { DiscountRepositoryInterface } from 'src/product/domain/port/persistance/discount-repository-interface';
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],

  providers: [
    OrderRepositoryTypeOrm,
    PdfGeneratorService,
    EmailService,
    {
      provide: GenerateInvoiceService,
      useFactory: (
        orderRepository: OrderRepositoryInterface,
        pdfGeneratorService: PdfGeneratorServiceInterface,
      ) => {
        return new GenerateInvoiceService();
      },
      inject: [OrderRepositoryTypeOrm, PdfGeneratorService],
    },
    {
      provide: PayOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new PayOrderService(orderRepository);
      },
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
      provide: CreateOrderService,
      useFactory: (
        orderRepository: OrderRepositoryInterface,
        productRepository: ProductRepositoryInterface,
        emailService: EmailServiceInterface,
        discountService: DiscountRepositoryInterface,
      ) => {
        return new CreateOrderService(
          orderRepository,
          productRepository,
          emailService,
          discountService,
        );
      },
      inject: [OrderRepositoryTypeOrm, EmailService, ProductRepositoryImpl, DiscountRepositoryImpl],
    },
  ],
})
export class OrderModule {}
