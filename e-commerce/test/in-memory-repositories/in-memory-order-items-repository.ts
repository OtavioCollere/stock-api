import { OrderItemsRepository } from "@/store/domain/application/repositories/order-item-repository";
import { OrderItem } from "@/store/domain/enterprise/entities/order-item";

export class InMemoryOrderItemsRepository implements OrderItemsRepository{
  public items: OrderItem[] = []

  async create(orderItem: OrderItem): Promise<OrderItem> {
    this.items.push(orderItem)
    return orderItem
  }

  async save(orderItem: OrderItem): Promise<OrderItem> {
    const index = this.items.findIndex(i => i.id.equals(orderItem.id))

    if (index >= 0) {
      this.items[index] = orderItem
    } else {
      this.items.push(orderItem)
    }

    return orderItem
  }

  async findById(id: string): Promise<OrderItem | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    this.items = this.items.filter((item) => item.orderId?.toString() === orderId)
  }
}
