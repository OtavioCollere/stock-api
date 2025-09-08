import { Entity } from "@/store/core/entities/entity";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Optional } from "@prisma/client/runtime/library"

export interface OrderItemProps {
  productId: UniqueEntityID
  quantity: number
  unitPrice: number
  discount?: number
  subTotal: number
}

export class OrderItem extends Entity<OrderItemProps> {

  static create(props: Optional<OrderItemProps, 'discount'>, id?: UniqueEntityID) {
    const orderItem = new OrderItem({
      discount: props.discount ?? 0,
      ...props,
    }, id)

    return orderItem
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

  get discount(): number {
    return this.props.discount ?? 0
  }

  get subTotal(): number {
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

  set discount(value: number) {
    this.props.discount = value
  }

  set subTotal(value: number) {
    this.props.subTotal = value
  }
}
