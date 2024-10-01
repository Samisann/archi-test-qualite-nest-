import { BadRequestException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';

export interface ItemDetailCommand {
  productName: string;
  price: number;
}

export interface CreateOrderCommand {
  items: ItemDetailCommand[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

export class CreateOrderService {
  createOrder(createOrderCommand: CreateOrderCommand): string {
    const { items, customerName, shippingAddress, invoiceAddress } =
      createOrderCommand;

    if (
      !customerName ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !invoiceAddress
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (items.length > Order.MAX_ITEMS) {
      throw new BadRequestException(
        'Cannot create order with more than 5 items',
      );
    }

    const totalAmount = this.calculateOrderAmount(items);

    return 'OK. Montant de la commande: ' + totalAmount;
  }

  private calculateOrderAmount(items: ItemDetailCommand[]): number {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    if (totalAmount < Order.AMOUNT_MINIMUM) {
      throw new BadRequestException(
        `Cannot create order with total amount less than ${Order.AMOUNT_MINIMUM}€`,
      );
    }

    return totalAmount;
  }
}