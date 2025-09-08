import { OrdersRepository } from "@/store/domain/application/repositories/orders-repository";
import { Order } from "@/store/domain/enterprise/entities/order";

export class InMemoryOrdersRepository extends OrdersRepository{
  public items : Order[] = [];

  async create(order: Order): Promise<Order> {
    this.items.push(order)
    return order
  }

  async findById(id: string): Promise<Order | null> {
    return this.items.find(order => order.id.equals(id)) ?? null
  }

  save(id: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }
    
}