import { Injectable } from '@nestjs/common';
import validationService from './validation/validation.service';
import { emailService } from './email.service';
import { smsService } from './sms.service';
import OrderRepository from '../infrastructure/order.repository';
 
@Injectable()
export class orderManagerService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderValidationService: validationService,
    private readonly emailService: emailService,
    private readonly smsService: smsService,
  ) {}
 
  async processOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
 
    this.orderValidationService.validateOrder(order);
 
    await this.emailService.sendOrderConfirmation(order);
    await this.smsService.sendOrderConfirmation(order);
 
    await this.orderRepository.save(order);
  }
}
 