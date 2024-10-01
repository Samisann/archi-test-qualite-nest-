import OrderRepository from 'src/order/infrastructure/order.repository';
import { Order } from '../entity/order.entity';
import { BadRequestException, Inject } from '@nestjs/common';

class orderPaidService {
  private orders: Order[] = [];
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepository,
  ) {}

  async payOrder(orderId: string): Promise<Order> {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      throw new Error('Order not found with number ' + orderId);
    }

    try {
      order.pay();
     
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
    return order;
  }

  addOrder(order: Order): void {
    this.orders.push(order);
  }

  getOrders() {
    return this.orders;
  }
}

export default orderPaidService;
