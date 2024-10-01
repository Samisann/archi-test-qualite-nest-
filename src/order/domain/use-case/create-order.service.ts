// create the service
import { BadRequestException } from '@nestjs/common';
import { Order } from '../entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';
import { v4 as uuidv4 } from 'uuid';

class CreateOrderService {
  private orders: Order[] = [];
  async createOrder(orderData: any): Promise<Order> {
    
    const validationMessage = await this.checkOrder(orderData);
    if (validationMessage !== true) {
      throw new BadRequestException(validationMessage);
    }

    
    const newOrder = new Order();
    newOrder.id = this.generateOrderId(); 
    newOrder.customerName = orderData.customerName;
    newOrder.shippingAddress = orderData.shippingAddress;
    newOrder.invoiceAddress = orderData.invoiceAddress;
    newOrder.orderItems = orderData.orderItems;
    newOrder.price = this.calculateTotalPrice(orderData.orderItems);
    newOrder.createdAt = new Date(); 


    this.orders.push(newOrder);

    return newOrder; 
}

 
    private calculateTotalPrice(orderItems: any[]): number {
      return orderItems.reduce((sum, item) => sum + item.price, 0);
  }


  private generateOrderId(): string {
      return 'order-' + Math.random().toString(36).substr(2, 9); 
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
