import { Product } from '../../entity/product.entity';

export interface ProductRepositoryInterface {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
  findById(productId: string): Product;
  findAll(isActive?: boolean): Promise<Product[]>;
  decrement(product: Product, quantity: number): void;
}
