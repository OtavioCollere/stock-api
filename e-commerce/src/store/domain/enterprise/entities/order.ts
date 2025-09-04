import { AggregateRoot } from "@/store/core/entities/aggregate-root";
import type { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

export interface OrderProps{
  customerId : UniqueEntityID,
  totalAmount: number
  deliveryAddress: string
  items : OrderItem[]
  status : 'pending' | 'paid' | 'delivered' | 'cancelled'
  createdAt : Date
  updatedAt : Date
}

export class Order extends AggregateRoot<OrderProps>{
  static create(){}
}