import { BadRequestException, Controller, Get } from '@nestjs/common';
import {CreateOrderService} from '../domain/use-case/create-order.service';
import  { PayOrderService } from '../domain/use-case/pay-order.service';
import {SetShippingAddressOrderService} from '../domain/use-case/set-shipping-adress-order.service';
import { Body, Post, Param } from '@nestjs/common';
import { SetInvoiceAddressOrderService } from '../domain/use-case/set-invoice-adress.service';
import { CancelOrderService } from '../domain/use-case/cancel-order.service';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly CreateOrderService: CreateOrderService,
    private readonly payOrder: PayOrderService,
    private readonly SetShippingAddressOrderService: SetShippingAddressOrderService,
    private readonly SetInvoicesOrderService: SetInvoiceAddressOrderService,
    private readonly CancelOrderService: CancelOrderService,
  ) {}
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post('createOrder')
  async createOrder(@Body() order: any) {
    const newOrder = await this.CreateOrderService.createOrder(order);
    this.payOrder.execute(newOrder);

    return newOrder;
  }

  @Post('pay/:orderId')
  async paidOrder(@Param('orderId') orderId: string) {
    return this.payOrder.execute(orderId);
  }

  @Post('addDelivery/:orderId')
  async addDelivery(
    @Body('newAddress') newAddress: string,
    @Param('orderId') orderId: string,
  ) {
    return this.SetShippingAddressOrderService.execute(orderId, newAddress);
  }

  @Post('setInvoice/:orderId')
  async setInvoice(
    @Body('newAddress') newAddress: string,
    @Param('orderId') orderId: string,
  ) {
    return this.SetInvoicesOrderService.execute(orderId, newAddress);
  }

  @Post('cancel/:orderId')
  async cancelOrder(
    @Body('reason') reason: string,
    @Param('orderId') orderId: string,
  ) {
    return this.CancelOrderService.execute(orderId, reason);
  }

}
