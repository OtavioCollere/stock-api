import { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import { OrderItem } from "@/store/domain/enterprise/entities/order-item"
import type { OrderItem as PrismaOrderItem, Prisma } from "@prisma/client"

export class PrismaOrderItemMapper {
  static toDomain(raw: PrismaOrderItem): OrderItem {
    return OrderItem.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        productId: new UniqueEntityID(raw.productId),
        quantity: raw.quantity,
        unitPrice: raw.unitPrice,
        subTotal: raw.subTotal,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(item: OrderItem): Prisma.OrderItemUncheckedCreateInput {
    return {
      id: item.id.toString(),
      orderId: item.orderId?.toString()!,
      productId: item.productId.toString(),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subTotal: item.subTotal,
    }
  }
}
