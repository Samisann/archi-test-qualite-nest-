import { BadRequestException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';

export interface ItemDetailCommand {
  productName: string;
  price: number;
}

export interface CreateOrderCommand {
  items: ItemDetailCommand[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

export class CreateOrderService{
  async createOrder(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const order = new Order(createOrderCommand);


    return order;
  }
}