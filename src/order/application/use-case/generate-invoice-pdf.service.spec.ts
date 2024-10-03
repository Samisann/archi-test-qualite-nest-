import { CreateOrderService } from './create-order.service';
import { Order, OrderStatus } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { GenerateInvoiceService } from './generate-invoice-pdf.service';
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

// testing the pdf generation
describe('GenerateInvoiceService', () => {
  let generateInvoiceService: GenerateInvoiceService;

  beforeEach(() => {
    generateInvoiceService = new GenerateInvoiceService(orderRepositoryFake, {
      generatePdf: jest.fn().mockResolvedValue(Buffer.from('pdf content')),
    });
  });

  it('should not be able to generate an invoice for an order that does not exist', async () => {
    await expect(generateInvoiceService.generateInvoice('1')).rejects.toThrow();
  });

  it('should be able to generate an invoice for an order', async () => {
    const order = await new CreateOrderService(orderRepositoryFake).execute({
      customerName: 'John Doe',
      items: [{ productName: 'item 1', price: 10, quantity: 1 }],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });
    order.pay();
    const invoice = await generateInvoiceService.generateInvoice(order.id);
    expect(invoice).toEqual(Buffer.from('pdf content'));
  });
});
