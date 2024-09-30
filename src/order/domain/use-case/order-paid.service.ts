import OrderRepository from "src/order/infrastructure/order.repository";
import { Order } from "../entity/order.entity";


class orderPaidService {
    private orders: Order[] = [];
  constructor(private readonly orderRepository: OrderRepository) {}

  async paid(orderId: string): Promise<Order> {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      throw new Error('Order not found with number ' + orderId);
    }

    

    order.pay();
    return order;
  }

  addOrder(order: Order):void {
    this.orders.push(order);
  }

  getOrders() {
    return this.orders;
  }
  
}

export default orderPaidService;