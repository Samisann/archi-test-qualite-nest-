import { PdfGeneratorServiceInterface } from 'src/order/domain/port/pdf/generate-invoice-pdf.service.interface';
import { PdfDocument } from '@ironsoftware/ironpdf';
export class PdfGeneratorService implements PdfGeneratorServiceInterface {
  async generatePdf(text: string): Promise<Buffer> {
    const pdf = await PdfDocument.fromHtml(`<html><body>${text}</body></html>`);
    return pdf.saveAsBuffer();
  }
}