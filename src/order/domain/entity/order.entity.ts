import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

export enum OrderStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}
@Entity()
export class Order {
  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  @Expose({ groups: ['group_orders'] })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
   status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  paidAt: Date | null;

  pay(): void {
    if (this.price > 500) {
      throw new Error('Order is more than 500 euros');
    }



    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }
  addDelivery(newAddress: string): void {
    if (this.orderItems.length <= 3) {
      throw new Error(
        'Cannot add shipping address, your order must contain more than 3 items.',
      );
    }

    if (
      this.status !== OrderStatus.PENDING &&
      this.shippingAddressSetAt === null
    ) {
      throw new Error(
        'Cannot add shipping address, your order must be pending or already have a shipping address.',
      );
    }

    this.shippingAddress = newAddress;

   
    this.price += 5;
    


    this.shippingAddressSetAt = new Date();
  }
}
