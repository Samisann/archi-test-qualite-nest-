import { CreateOrderService } from '../use-case/create-order.service';
import { Order } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { EmailService } from 'src/product/infrastructure/presentation/email.service';
import { Product } from '../../../product/domain/entity/product.entity';
import { ProductRepositoryInterface } from '../../../product/domain/port/persistance/product-repository.interface';
class OrderRepositoryFake implements OrderRepositoryInterface {
  private orders: Order[] = [];

  async findById(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.id === orderId) || null;
  }

  async save(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  // Méthodes manquantes de l'interface, que tu peux remplir si nécessaire
  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findByCustomerName(customerName: string): Promise<Order[]> {
    return this.orders.filter(order => order.customerName === customerName);

  }

  async deleteOrder(orderId: string): Promise<void> {
    this.orders = this.orders.filter(order => order.id !== orderId);
  }

  async findOrdersByProductId(productId: string): Promise<Order[]> {
    return this.orders.filter(order =>
      order.orderItems.some(item => item.id === productId)
    );
  }
}


class productRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }

  findById(productId: string): Product {
    return this.products.find(p => p.id === productId) || null;
  }

  async findAll(isActive?: boolean): Promise<Product[]> {
    if (!isActive) return this.products;
    return this.products.filter(p => p.isActive);
  }

  async delete(productId: string): Promise<void> {
    const product = await this.findById(productId);

    if (!product) {
      throw new Error("The product doesn't exist");
    }



    const index = this.products.findIndex(p => p.id === productId);

    if (index > -1) {
      this.products.splice(index, 1);
    }
  }

  decrementStock(product: Product, quantity: number): void {
    if (product.stock - quantity < 0) {
      throw new Error('Stock insuffisant');
    }
    product.stock -= quantity;
  }

  const orderRepositoryFake =
    new OrderRepositoryFake() as OrderRepositoryInterface;

  const productRepositoryFake =
    new productRepositoryFake() as ProductRepositoryInterface;

  describe("an order can't be created if the order have more than 5 item", () => {
    it('should return an error', async () => {
      const createOrderService = new CreateOrderService(
        orderRepositoryFake,
        productRepositoryFake,
        EmailService,
      );

      await expect(
        createOrderService.execute({
          customerName: 'John Doe',
          items: [
            { id: '1', productName: 'Product 1', price: 10, quantity: 1 },
            { id: '2', productName: 'Product 2', price: 20, quantity: 1 },
            { id: '3', productName: 'Product 3', price: 30, quantity: 1 },
            { id: '4', productName: 'Product 4', price: 40, quantity: 1 },
            { id: '5', productName: 'Product 5', price: 50, quantity: 1 },
            { id: '6', productName: 'Product 6', price: 60, quantity: 1 },
          ],
          shippingAddress: 'Shipping Address',
          invoiceAddress: 'Invoice Address',
        }),
      ).rejects.toThrow();
    });
  });
