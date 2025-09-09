import { OrderItem } from "../../enterprise/entities/order-item";

export abstract class OrderItemsRepository{
  abstract create(orderItem: OrderItem) : Promise<OrderItem>
  abstract save(orderItem: OrderItem) : Promise<OrderItem>
  abstract findById(id : string) : Promise<OrderItem | null>
  abstract deleteByOrderId(orderId : string) : void
}