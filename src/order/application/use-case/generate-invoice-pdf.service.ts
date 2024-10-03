import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';
import { generatePdfInterface } from 'src/order/domain/port/generate-invoice-pdf.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';

export class GenerateOrderPdfService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly pdfGenerator: generatePdfInterface,
  ) {}

  async execute(orderId: string): Promise<Buffer> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.isPaid()) {
      throw new BadRequestException('Cannot generate invoice for unpaid order');
    }

    const items = order.getOrderItemsForPdf();

    return this.pdfGenerator.generateOrderPdf(order.id, items);
  }
}
