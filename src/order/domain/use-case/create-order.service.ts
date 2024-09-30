// create the service
import { BadRequestException } from '@nestjs/common';
import { Order } from '../entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';
import { v4 as uuidv4 } from 'uuid';

class CreateOrderService {
  private orders: Order[] = [];
  async createOrder(order: any): Promise<Order> {
    const checkOrder = await this.checkOrder(order);
    if (checkOrder !== true) {
      throw new BadRequestException(checkOrder);
    }
    const newOrder = new Order();
    Object.assign(newOrder, order);
    newOrder.id = uuidv4();
    this.orders.push(newOrder);
    console.log('newOrder', newOrder);
    return newOrder;
  }

  async checkOrder(order: any): Promise<boolean | string> {
    if (!order.orderItems || order.orderItems.length === 0) {
      return 'It should have at least one item';
    }

    if (order.orderItems.length > 5) {
      return 'impossible to order more than 5 items';
    }

    if (order.price < 10) {
      return 'price should be more than 10 euros';
    }

    if (
      !order.customerName ||
      !order.shippingAddress ||
      !order.invoiceAddress
    ) {
      return 'customerName, shippingAddress and invoiceAddress are missing';
    }
    return true;
  }
}

export default CreateOrderService;
