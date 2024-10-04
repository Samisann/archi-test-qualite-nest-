import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import {
  CreateOrderCommand,
  Order,
} from 'src/order/domain/entity/order.entity';
import { CreateOrderService } from 'src/order/application/use-case/create-order.service';
import { PayOrderService } from 'src/order/application/use-case/pay-order.service';
import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GenerateInvoiceService } from 'src/order/application/use-case/generate-invoice-pdf.service';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly payOrderService: PayOrderService,
    private readonly GenerateOrderPdfService: GenerateInvoiceService,
  ) {}

  @Post()
  async createOrder(
    @Body() createOrderCommand: CreateOrderCommand,
  ): Promise<Order> {
    return this.createOrderService.execute(createOrderCommand);
  }

  @Post()
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.execute(id);
  }

  // @Get(':orderId/invoice')
  // async generateInvoice(@Param('orderId') orderId: string, @Res() res: Response) {
  //   try {

  //     const pdfBuffer = await this.GenerateOrderPdfService.generateInvoice(orderId);

  //     res.set({
  //       'Content-Type': 'application/pdf',
  //       'Content-Disposition': `attachment; filename="invoice-${orderId}.pdf"`,
  //     });

  //     res.send(pdfBuffer);
  //   } catch (error) {

  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
