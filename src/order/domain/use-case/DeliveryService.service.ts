import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';
import { OrderItem } from '../entity/order-item.entity';
 
@Injectable()
export class DeliveryService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}
 
  private async getMock(orderId: string): Promise<Order> {
    const mock = new Order();
 
    mock.id = orderId;
    mock.customerName = 'test';
    mock.shippingAddress = '';
    mock.invoiceAddress = '123 test';
    const item1 = new OrderItem();
    item1.productName = 'Produit A';
    item1.price = 220;
 
    const item2 = new OrderItem();
    item2.productName = 'Produit C';
    item2.price = 20;
 
    const item3 = new OrderItem();
    item3.productName = 'Produit B';
    item3.price = 300;
 
    mock.orderItems = [item1, item2, item3, item3];
 
    mock.price = 540;
    mock.status = OrderStatus.PENDING;
    mock.createdAt = new Date();
    mock.paidAt = null;
    mock.shippingAddressSetAt = null;
 
    return mock;
  }
 
 
  async addDelivery(orderId: string, newAddress : string) {
    const order = await this.getMock(orderId);
 
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
 
    try {
      order.addDelivery(newAddress);
    } catch (error) {
      throw new BadRequestException(`Cannot add delivery: ${error.message}`);
    }
 
    return `address added to order ${newAddress} au prix de ${order.price}`;
  }
}
 