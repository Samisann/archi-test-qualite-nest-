import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';

class validationService {
  validateOrder(order: Order): void  {
    if (!order) {
      throw new NotFoundException('Pas de commande');
    }
  }
}
export default validationService;