import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { CreateOrderCommand, Order } from '../../domain/entity/order.entity';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product-repository.interface';
import { EmailService } from 'src/product/infrastructure/presentation/email.service';
import { DiscountRepositoryInterface } from 'src/product/domain/port/persistance/discount-repository-interface';

export class CreateOrderService {
  // j'injecte l'interface dans le constructeur
  // le système d'injection de Nest JS va me permettre
  // de configurer dans le orderModule quelle classe va reellement être injectée
  // (il faut bien sûr que la classe en question implémente l'interface, sinon ça n'est pas possible)
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly emailService: EmailService,
    private readonly discountService: DiscountRepositoryInterface,
  ) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const orderItems = [];

    for (const item of createOrderCommand.items) {
      const product = await this.productRepository.findById(item.id);

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.isInStock() || product.stock < item.quantity) {
        await this.emailService.sendEmail(product);
      }

      this.productRepository.decrement(product, item.quantity);

      orderItems.push({
        id: item.id,
        ProductName: item.productName,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = new Order({
      customerName: createOrderCommand.customerName,
      items: orderItems,
      shippingAddress: createOrderCommand.shippingAddress,
      invoiceAddress: createOrderCommand.invoiceAddress,
    });

    const discount = await this.discountService.findById(
      createOrderCommand.code,
    );

    if (discount) {
      order.applyDiscount(discount);
    }

    await this.orderRepository.save(order);

    return order;
  }
}
