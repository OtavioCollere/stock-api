import { OrderItem } from "../../enterprise/entities/order-item";

export abstract class OrderItemsRepository{
  abstract create(orderItem: OrderItem) : Promise<OrderItem>
  abstract deleteByOrderId(orderId : string) : void
}