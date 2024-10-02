import { BadRequestException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';

export interface ItemDetailCommand {
  productName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderCommand {
  items: ItemDetailCommand[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

export class CreateOrderService{
  constructor(private readonly orderRepository: OrderRepository) {}
  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const order = new Order(createOrderCommand);
    const repository = await this.orderRepository.save(order);


    return repository;
  }
}