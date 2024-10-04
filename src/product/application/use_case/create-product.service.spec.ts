import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";
import { CreateProductService } from "./create-product.service";

describe('CreateProductService', () => {
  let createProductService: CreateProductService;
  let productRepository: ProductRepositoryInterface;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any; 
    createProductService = new CreateProductService(productRepository);
  });

  it('should create a product', async () => {
    const name = 'Product A';
    const price = 100;
    const description = 'Description A';

    await createProductService.execute(name, price, description, 10);

    expect(productRepository.create).toHaveBeenCalled();
  });

  it('should throw an error if name is missing', async () => {
    await expect(createProductService.execute('', 100, 'Description A')).rejects.toThrow(Error);
  });

});
