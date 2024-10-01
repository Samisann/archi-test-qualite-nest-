import { NotFoundException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';

export class SetShippingAddressOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    orderId: string,
    customerAddress: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    order.setShippingAddress(customerAddress);

    return this.orderRepository.save(order);
  }
}