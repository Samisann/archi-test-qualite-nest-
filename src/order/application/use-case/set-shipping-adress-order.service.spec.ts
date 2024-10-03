import { CreateOrderService } from './create-order.service';
import { Order } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { SetShippingAddressOrderService } from './set-shipping-adress-order.service';

class OrderRepositoryFake implements OrderRepositoryInterface {
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

describe('SetShippingAddressOrderService', () => {
  let setShippingAddressOrderService: SetShippingAddressOrderService;

  beforeEach(() => {
    setShippingAddressOrderService = new SetShippingAddressOrderService(
      orderRepositoryFake,
    );
  });

  it('should not be able to set the shipping address of an order that does not exist', async () => {
    await expect(
      setShippingAddressOrderService.execute('1', 'Shipping Address'),
    ).rejects.toThrow();
  });

  it('should be able to set the shipping address of an order', async () => {
    
    const order = await new CreateOrderService(orderRepositoryFake).execute({
      customerName: 'John Doe',
      items: [
        { productName: 'item 1', price: 10, quantity: 1 },
        { productName: 'item 2', price: 20, quantity: 1 },
        { productName: 'item 3', price: 30, quantity: 1 },
        { productName: 'item 4', price: 40, quantity: 1 },
        { productName: 'item 5', price: 50, quantity: 1 }, 
      ],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    await setShippingAddressOrderService.execute(
      order.id,
      'New Shipping Address',
    );

    const updatedOrder = await orderRepositoryFake.findById(order.id);
    expect(updatedOrder?.shippingAddress).toEqual('New Shipping Address');
  });
});
