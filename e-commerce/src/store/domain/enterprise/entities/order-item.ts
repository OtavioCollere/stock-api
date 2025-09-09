import { Entity } from "@/store/core/entities/entity";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Optional } from "@prisma/client/runtime/library"

export interface OrderItemProps {
  orderId? : UniqueEntityID
  productId: UniqueEntityID
  quantity: number
  unitPrice: number
  subTotal?: number
  createdAt?: Date
  updatedAt?: Date
}

export class OrderItem extends Entity<OrderItemProps> {

  static create(props: Optional<OrderItemProps, 'createdAt' | 'updatedAt' |  'subTotal'>, id?: UniqueEntityID) {
    const orderItem = new OrderItem({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      subTotal : (props.quantity * props.unitPrice)
    }, id)

    return orderItem
  }

  get orderId(): UniqueEntityID | undefined {
    return this.props.orderId
  }

  // Getters
  get productId(): UniqueEntityID {
    return this.props.productId
  }

  get quantity(): number {
    return this.props.quantity
  }

  get unitPrice(): number {
    return this.props.unitPrice
  }


  get subTotal(): number | undefined {
    return this.props.subTotal
  }

  // Setters
  set productId(value: UniqueEntityID) {
    this.props.productId = value
  }

  set quantity(value: number) {
    this.props.quantity = value
  }

  set unitPrice(value: number) {
    this.props.unitPrice = value
  }

  set subTotal(value: number) {
    this.props.subTotal = value
  }
}
