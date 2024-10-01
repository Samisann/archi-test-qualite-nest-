import { BadRequestException, Controller, Get } from '@nestjs/common';
import CreateOrderService from '../domain/use-case/create-order.service';
import orderPaidService from '../domain/use-case/PayOrder.service';
import { Body, Post, Param } from '@nestjs/common';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly CreateOrderService: CreateOrderService,
    private readonly orderPaidService: orderPaidService,
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
}
