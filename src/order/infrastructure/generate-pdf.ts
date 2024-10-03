import { Injectable } from '@nestjs/common';
import { generatePdfInterface } from 'src/order/domain/port/generate-invoice-pdf.interface';
import { PdfDocument } from '@ironsoftware/ironpdf';
import { promises as fs } from 'fs';
import { OrderItem } from '../domain/entity/order-item.entity';
import { join } from 'path';

@Injectable()
export class pdfGenerator implements generatePdfInterface {
  async generateOrderPdf(orderId: string, items: OrderItem[]): Promise<Buffer> {
 
    const htmlContent = `
      <html>
      <body>
        <h1>Order ID: ${orderId}</h1>
        <h2>Items:</h2>
        <ul>
          ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    const pdf = await PdfDocument.fromHtml(htmlContent);
 
    const tempPath = join(__dirname, `order_${orderId}.pdf`);
 
    await pdf.saveAs(tempPath);
 
    const pdfBuffer = await fs.readFile(tempPath);
 
    await fs.unlink(tempPath);
 
    return pdfBuffer;
  }
}
