// src/product/domain/entity/product.entity.ts
export class Product {
  constructor(
    public readonly id: string,
    private name: string,
    public price: number,
    public stock: number = 0,
    public isActive: boolean = true,
    public description: string,
  ) {
    this.validateProduct();
  }

  private validateProduct() {
    if (!this.name || !this.price || !this.description) {
      throw new Error('Product must have a name, price, and description.');
    }
    if (this.stock === undefined || this.stock === null) {
      this.stock = 0;
    }
  }

  update(name: string, price: number, description: string) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.validateProduct();
  }

  isInStock(): boolean {
    return this.stock > 0;
  }
}
