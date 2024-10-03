import { NotFoundException } from '@nestjs/common';
import { CancelOrderService } from './cancel-order.service';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { CreateOrderCommand, Order, OrderStatus } from '../../domain/entity/order.entity';
 
class OrderRepositoryFake implements OrderRepositoryInterface {
    private orders = new Map<string, Order>();
 
    async findById(orderId: string): Promise<Order | undefined> {
      return this.orders.get(orderId);
    }
 
    async save(order: Order): Promise<Order> {
      this.orders.set(order.id, order);
      return order;
    }
 
    // Méthodes fictives
    async findAll(): Promise<Order[]> {
      return Array.from(this.orders.values());
    }
 
    async findByCustomerName(customerName: string): Promise<Order[]> {
      return Array.from(this.orders.values()).filter(order => order.customerName === customerName);
    }
 
    async deleteOrder(orderId: string): Promise<void> {
      this.orders.delete(orderId);
    }
  }
 
describe('CancelOrderService', () => {
  let cancelOrderService: CancelOrderService;
  let orderRepositoryFake: OrderRepositoryFake;
 
  beforeEach(() => {
    orderRepositoryFake = new OrderRepositoryFake();
    cancelOrderService = new CancelOrderService(orderRepositoryFake as OrderRepositoryInterface);
  });
 
  it('should throw NotFoundException if the order does not exist', async () => {
    await expect(
      cancelOrderService.execute('non-existent-order-id', 'Customer changed mind'),
    ).rejects.toThrow(NotFoundException);
  });
 
  it('should cancel the order successfully if the order exists and is not shipped, delivered, or already canceled', async () => {
    const createOrderCommand: CreateOrderCommand = {
      customerName: 'John Doe',
      items: [
        { productName: 'item 1', price: 10, quantity: 1 },
      ],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    };
   
    const order = new Order(createOrderCommand);
    await orderRepositoryFake.save(order);
 
    const canceledOrder = await cancelOrderService.execute(order.id, 'Customer changed mind');
 
    expect((canceledOrder as any).status).toBe(OrderStatus.CANCELED);
    expect((canceledOrder as any).cancelReason).toBe('Customer changed mind');
    expect((canceledOrder as any).cancelAt).toBeDefined();
  });
 
  it('should throw an error if the order is already shipped, delivered, or canceled', async () => {
    const createOrderCommand: CreateOrderCommand = {
      customerName: 'John Doe',
      items: [
        { productName: 'item 1', price: 10, quantity: 1 },
      ],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    };
   
    const order = new Order(createOrderCommand);
    (order as any).status = OrderStatus.SHIPPED;  
    await orderRepositoryFake.save(order);
 
    await expect(
      cancelOrderService.execute(order.id, 'Customer changed mind'),
    ).rejects.toThrow('Vous ne pouvez pas annuler cette commande');
  });
});
 
