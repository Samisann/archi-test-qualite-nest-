import { CreateOrderService } from '../use-case/create-order.service';
import { Order, OrderStatus } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import PayOrderService from './pay-order.service';
class OrderRepositoryFake {
  private orders: { [key: string]: Order } = {};
  async save(order: Order): Promise<Order> {
    this.orders[order.id] = order;
    return order;
  }

  async findById(orderId: string): Promise<Order | null> {
    return this.orders[orderId] || null;
  }

  async findAll(): Promise<Order[]> {
    return Object.values(this.orders);
  }

  async findByCustomerName(customerName: string): Promise<Order[]> {
    return Object.values(this.orders).filter(
      (order) => order.customerName === customerName,
    );
  }

  async deleteOrder(orderId: string): Promise<void> {
    delete this.orders[orderId];
  }
}

const orderRepositoryFake =
  new OrderRepositoryFake() as OrderRepositoryInterface;

// testing pay order service
describe('PayOrderService', () => {
  let payOrderService: PayOrderService;

  beforeEach(() => {
    payOrderService = new PayOrderService(orderRepositoryFake);
  });

  it('should not be able to pay an order that does not exist', async () => {
    await expect(payOrderService.execute('1')).rejects.toThrow();
  });

  it("should not be able to pay an order that haven't a pending status", async () => {
    const order = await new CreateOrderService(orderRepositoryFake).execute({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 10, quantity: 1 }],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });
    order.setStatus(OrderStatus.PAID);
    await expect(payOrderService.execute(order.id)).rejects.toThrow(
      'Commande déjà payée',
    );
  });

  it('should be inferior to 500', async () => {
    const order = await new CreateOrderService(orderRepositoryFake).execute({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 10, quantity: 1 }],

      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });
    order.price = 500;

    const orderPaid = await payOrderService.execute(order.id);
    // throw an error if the price is superior to 500
    expect(orderPaid.price).toBeLessThanOrEqual(500);
  });
});
