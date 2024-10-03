import { OrderItem } from "../entity/order-item.entity";


export interface generatePdfInterface {
    generateOrderPdf(orderId: string, items: OrderItem[]): Promise<Buffer>;
  }
  