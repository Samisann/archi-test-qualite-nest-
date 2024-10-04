import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';
import OrderRepository from 'src/order/infrastructure/bdd/order.repository';

export class ProductRepositoryImpl implements ProductRepositoryInterface {
  private products: Product[] = [];
  OrderRepository: OrderRepository;

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }

  findById(productId: string): Product {
    return this.products.find((p) => p.id === productId) || null;
  }

  async findAll(isActive?: boolean): Promise<Product[]> {
    if (!isActive) return this.products;
    return this.products.filter((p) => p.isActive);
  }

  async delete(productId: string): Promise<void> {
    const product = await this.findById(productId);

    if (!product) {
      throw new Error("The product doesn't exist");
    }

    const orders = await this.OrderRepository.findById(productId);

    if (orders) {
      throw new Error(
        'Impossible to delete the product, it is linked to an order',
      );
    }

    const index = this.products.findIndex((p) => p.id === productId);

    if (index > -1) {
      this.products.splice(index, 1);
    }
  }

  decrement(product: Product, quantity: number): void {
    if (product.stock - quantity < 0) {
      throw new Error('Stock insuffisant');
    }
    product.stock -= quantity;
  }
}
