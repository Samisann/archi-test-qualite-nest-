import { BadRequestException, Controller, Get } from '@nestjs/common';
import CreateOrderService from '../domain/use-case/create-order.service';
import { Body, Post, Param } from '@nestjs/common';

@Controller('/orders')
export default class OrderController {
  constructor(private readonly CreateOrderService: CreateOrderService) {}
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post('createOrder')
  async createOrder(@Body() order: any) {
    return this.CreateOrderService.createOrder(order);
  }
}
