import type { OrdersRepository } from "@/store/domain/application/repositories/orders-repository";
import type { Order } from "@/store/domain/enterprise/entities/order";

export class PrismaOrdersRepository implements OrdersRepository{
  create(order: Order): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  save(order: Order): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }
}