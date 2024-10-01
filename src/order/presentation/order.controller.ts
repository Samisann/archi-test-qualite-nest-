import { BadRequestException, Controller, Get } from '@nestjs/common';
import CreateOrderService from '../domain/use-case/create-order.service';
import orderPaidService from '../domain/use-case/PayOrder.service';
import {DeliveryService} from '../domain/use-case/DeliveryService.service';
import { Body, Post, Param } from '@nestjs/common';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly CreateOrderService: CreateOrderService,
    private readonly orderPaidService: orderPaidService,
    private readonly DeliveryService: DeliveryService,
  ) {}
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post('createOrder')
  async createOrder(@Body() order: any) {
    const newOrder = await this.CreateOrderService.createOrder(order);
    this.orderPaidService.addOrder(newOrder);

    return newOrder;
  }

  @Post('pay/:orderId')
  async payOrder(@Param('orderId') orderId: string) {
    return this.orderPaidService.payOrder(orderId);
  }

  @Post('addDelivery/:orderId')
  async addDelivery(
    @Body('newAddress') newAddress: string,
    @Param('orderId') orderId: string,
  ) {
    return this.DeliveryService.addDelivery(orderId, newAddress);
  }
}
