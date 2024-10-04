import { Product } from '../../domain/entity/product.entity';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';

export class CreateProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(
    name: string,
    price: number,
    description: string,
    stock?: number,
  ): Promise<void> {
    const product = new Product('123', name, price, stock, true, description);
    await this.productRepository.create(product);
  }
}
