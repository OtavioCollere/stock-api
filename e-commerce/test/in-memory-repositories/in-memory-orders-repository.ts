import { OrderItemsRepository } from "@/store/domain/application/repositories/order-item-repository";
import { OrdersRepository } from "@/store/domain/application/repositories/orders-repository";
import { Order } from "@/store/domain/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrdersRepository{

  constructor(
    private orderItemsRepository : OrderItemsRepository
  ) {}

  public items : Order[] = [];

  async create(order: Order): Promise<Order> {
    this.items.push(order)

    const orderItems = order.orderItems

    for (const item of orderItems) {
      this.orderItemsRepository.create(item)
    }

    return order
  }

  async findById(id: string): Promise<Order | null> {
    return this.items.find(order => order.id.toString() === id) ?? null
  }

  async save(order: Order): Promise<Order> {
    
    const index = this.items.findIndex((item) => item.id.toString() === order.id.toString())

    if(index >= 0)
    {
      this.items[index] = order
    } else {
      this.items.push(order)
    }

    
    this.orderItemsRepository.deleteByOrderId(order.id.toString())
    
    const orderItems = order.orderItems;

    for (const item of orderItems){
      await this.orderItemsRepository.create(item)
    }

    return order
    
  }
    
}