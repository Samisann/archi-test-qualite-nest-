import { DiscountRepositoryInterface } from 'src/product/domain/port/persistance/discount-repository-interface';
import { Discount } from 'src/product/domain/entity/discount.entity';

export class DiscountRepositoryImpl implements DiscountRepositoryInterface {
  private discounts: Discount[] = [];

  async create(discount: Discount): Promise<void> {
    this.discounts.push(discount);
  }

  async delete(id: string): Promise<void> {
    this.discounts = this.discounts.filter((discount) => discount.id !== id);
  }

  async findAll(): Promise<Discount[]> {
    return this.discounts;
  }

  async findById(id: string): Promise<Discount> {
    return this.discounts.find((discount) => discount.id === id);
  }

  async update(discount: Discount): Promise<void> {
    const index = this.discounts.findIndex((d) => d.id === discount.id);
    if (index > -1) {
      this.discounts[index] = discount;
    }
  }
}
