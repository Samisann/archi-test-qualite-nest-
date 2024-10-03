import { NotFoundException } from '@nestjs/common';
import {
  Order,
  OrderStatus,
  CreateOrderCommand,
} from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { SetInvoiceAddressOrderService } from './set-invoice-adress.service';
class OrderRepositoryFake implements OrderRepositoryInterface {
  private orders: Order[] = [];

  async findById(orderId: string): Promise<Order | null> {
    return this.orders.find((order) => order.id === orderId) || null;
  }

  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findByCustomerName(customerName: string): Promise<Order[]> {
    return this.orders.filter((order) => order.customerName === customerName);
  }

  async deleteOrder(orderId: string): Promise<void> {
    this.orders = this.orders.filter((order) => order.id !== orderId);
  }

  async save(order: Order): Promise<Order> {
    
    const existingOrderIndex = this.orders.findIndex(
      (existingOrder) => existingOrder.id === order.id,
    );
    if (existingOrderIndex !== -1) {
      
      this.orders[existingOrderIndex] = order;
    } else {
      
      this.orders.push(order);
    }
    return order;
  }
}

const orderRepositoryFake = new OrderRepositoryFake();

describe('SetInvoiceAddressOrderService', () => {
  it("should throw NotFoundException if the order doesn't exist", async () => {
    const setInvoiceAddressService = new SetInvoiceAddressOrderService(
      orderRepositoryFake,
    );

    await expect(
      setInvoiceAddressService.execute(
        'non-existent-order-id',
        'New Invoice Address',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should set the invoice address if the order exists', async () => {
    const createOrderCommand: CreateOrderCommand = {
      items: [{ productName: 'item 1', price: 10, quantity: 1 }],
      customerName: 'John Doe',
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address', 
    };

    const order = new Order(createOrderCommand);
   
    order.setStatus(OrderStatus.SHIPPING_ADDRESS_SET); 

    await orderRepositoryFake.save(order);

    const setInvoiceAddressService = new SetInvoiceAddressOrderService(
      orderRepositoryFake,
    );

    const updatedOrder = await setInvoiceAddressService.execute(
      order.id,
      'New Invoice Address',
    );

    expect(updatedOrder.invoiceAddress).toBe('New Invoice Address');
  });
  it('should throw NotFoundException if the order doesn\'t exist', async () => {
    const setInvoiceAddressService = new SetInvoiceAddressOrderService(
      orderRepositoryFake,
    );
  
    await expect(
      setInvoiceAddressService.execute(
        'non-existent-order-id',
        'New Invoice Address',
      ),
    ).rejects.toThrow(NotFoundException);
  });
  
  it('should set the invoice address if the order exists', async () => {
    const createOrderCommand: CreateOrderCommand = {
      items: [{ productName: 'item 1', price: 10, quantity: 1 }],
      customerName: 'John Doe',
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    };
  
    const order = new Order(createOrderCommand);
    
   
    order.setShippingAddress('Shipping Address'); 
    order.setStatus(OrderStatus.SHIPPING_ADDRESS_SET); 
  
    await orderRepositoryFake.save(order);
  
    const setInvoiceAddressService = new SetInvoiceAddressOrderService(
      orderRepositoryFake,
    );
  
    const updatedOrder = await setInvoiceAddressService.execute(
      order.id,
      'New Invoice Address',
    );
  
    expect(updatedOrder.invoiceAddress).toBe('New Invoice Address');
  });
});
