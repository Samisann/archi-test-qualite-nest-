import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discount')
export class Discount {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ default: 1500 })
  amount: number;

  constructor(name: string, code: string, amount: number) {
    this.name = name;
    this.code = code;
    this.amount = 1500;
    if (amount) this.amount = amount;
    this.validateDiscount();
  }

  private validateDiscount() {
    if (!this.name || !this.code) {
      throw new Error('Discount must have a name and a code.');
    }
  }

  addDiscount(amount: number) {
    this.amount = amount;
  }

  removeDiscount() {
    this.amount = 0;
  }

  update(name: string, code: string, amount: number) {
    this.name = name;
    this.code = code;
    this.amount = amount;
    this.validateDiscount();
  }
}
