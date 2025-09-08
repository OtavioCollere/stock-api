import { AggregateRoot } from "@/store/core/entities/aggregate-root";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { OrderItem } from "./order-item";
import { Optional } from "@/store/core/types/optional"


export interface OrderProps {
  customerId: UniqueEntityID
  orderItems: OrderItem[]
  totalAmount: number
  deliveryAddress: string
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED'
  createdAt?: Date
  updatedAt?: Date
}

export class Order extends AggregateRoot<OrderProps> {

  static create(
    props: Optional<OrderProps, 'createdAt' | 'updatedAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order({
      ...props,
      status: props.status ?? 'PENDING',
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return order
  }

  // Getters
  get customerId(): UniqueEntityID {
    return this.props.customerId
  }

  get orderItems(): OrderItem[] {
    return this.props.orderItems
  }

  get totalAmount(): number {
    return this.props.totalAmount
  }

  get deliveryAddress(): string {
    return this.props.deliveryAddress
  }

  get status(): 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' {
    return this.props.status
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  // Setters
  set customerId(value: UniqueEntityID) {
    this.props.customerId = value
  }

  set orderItems(value: OrderItem[]) {
    this.props.orderItems = value
  }

  set totalAmount(value: number) {
    this.props.totalAmount = value
  }

  set deliveryAddress(value: string) {
    this.props.deliveryAddress = value
  }

  set status(value: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED') {
    this.props.status = value
  }

  set updatedAt(value: Date | undefined) {
    this.props.updatedAt = value
  }
}
