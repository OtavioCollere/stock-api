import type { Order } from "../../enterprise/entities/order";

export abstract class OrdersRepository{
  abstract create(order: Order) : Promise<Order>
  abstract save(order: Order) : Promise<Order>
  abstract findById(id : string) : Promise<Order | null>
}