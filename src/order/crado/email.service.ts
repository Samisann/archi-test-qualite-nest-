import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Order } from '../domain/entity/order.entity';
 
@Injectable()
export class emailService {
  private transporter;
 
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
  }
 
  async sendOrderConfirmation(order: Order): Promise<void> {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: order.customerEmail,
      subject: 'Confirmation de commande',
      text: `Votre commande numéro ${order.id} a été confirmée.`,
    };
 
    await this.transporter.sendMail(mailOptions);
  }
}
 