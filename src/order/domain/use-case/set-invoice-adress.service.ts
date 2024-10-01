import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';

export class SetInvoiceAddressOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  

  public async execute(
    orderId: string,
    invoiceAddress?: string, 
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande trouvée');
    }

    if (!order.shippingAddress) {
      throw new BadRequestException(
        "L'adresse de facturation ne peut être définie que si l'adresse de livraison est remplie",
      );
    }

    
    order.setInvoiceAddress(invoiceAddress || order.shippingAddress);

    return this.orderRepository.save(order);
  }
}