import { Product } from '../../entity/product.entity';
export interface EmailServiceInterface {
  sendEmail(product: Product): Promise<void>;
}
