import { DecrementStockService } from './decrement-stock.service';
import { Product } from '../../domain/entity/product.entity';
import { EmailService } from '../../infrastructure/presentation/email.service';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';

describe('DecrementStockService', () => {
  let decrementStockService: DecrementStockService;
  let productRepository: ProductRepositoryInterface;
  let emailService: EmailService;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any; // Stub du repository
    emailService = {
      sendStockAlert: jest.fn(),
    } as any; // Stub du service d'email
    decrementStockService = new DecrementStockService(productRepository, emailService);
  });

  it('should decrement stock and send email when stock reaches 0', async () => {
    const product = new Product('1', 'Product A', 100, 1, true, 'Description A');
    (productRepository.findById as jest.Mock).mockResolvedValue(product);

    await decrementStockService.execute('1', 1);

    expect(productRepository.update).toHaveBeenCalledWith(product);
    expect(emailService.sendStockAlert).toHaveBeenCalledWith(product);
  });

  it('should throw an error if stock is insufficient', async () => {
    const product = new Product('1', 'Product A', 100, 0, true, 'Description A');
    (productRepository.findById as jest.Mock).mockResolvedValue(product);

    await expect(decrementStockService.execute('1', 1)).rejects.toThrow('Stock insuffisant');
  });

  it('should throw an error if product is not found', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(decrementStockService.execute('2', 1)).rejects.toThrow('Produit non trouvé');
  });
});