import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";

export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Logique pour vérifier les commandes liées
    const hasOrder = false; // TODO: Implémenter la vérification des commandes liées
    if (hasOrder) {
      throw new Error('Cannot delete a product linked to an order.');
    }

    await this.productRepository.delete(productId);
  }
}
