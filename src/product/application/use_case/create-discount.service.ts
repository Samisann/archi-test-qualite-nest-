import { Discount } from '../../../product/domain/entity/discount.entity';
import { DiscountRepositoryInterface } from 'src/product/domain/port/persistance/discount-repository-interface';

export class createDiscountService{
  constructor(
    private readonly discountRepository: DiscountRepositoryInterface,
  ) {}

  async execute(name: string, code: string, amount: number): Promise<Discount> {
    const discount = new Discount(name, code, amount);

    await this.discountRepository.create(discount);

    return discount;
  }
}
