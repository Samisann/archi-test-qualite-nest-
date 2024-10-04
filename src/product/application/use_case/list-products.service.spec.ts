import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";
import { ListProductsService } from "./list-products.service";
import { Product } from "../../domain/entity/product.entity";

describe('ListProductsService', () => {
  let listProductsService: ListProductsService;
  let productRepository: ProductRepositoryInterface;

  beforeEach(() => {
    productRepository = {
      findAll: jest.fn(),
    } as any;
    listProductsService = new ListProductsService(productRepository);
  });

  it('should return a list of products', async () => {
    const products: Product[] = [new Product('1', 'Product A', 100, 10, true, 'Description A')];
    (productRepository.findAll as jest.Mock).mockResolvedValue(products);

    const result = await listProductsService.execute();

    expect(result).toEqual(products);
    expect(productRepository.findAll).toHaveBeenCalled();
  });
});
