import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Order } from "@/store/domain/enterprise/entities/order";
import { Order as PrismaOrder, type OrderItem, type Prisma } from "@prisma/client";
<<<<<<< HEAD
import { PrismaOrderItemMapper } from "./prima-order-item-mapper";
=======
import { PrismaOrderItemMapper } from "./prisma-order-item-mapper";
>>>>>>> efe5248c489bd7aaf11ea999df1b3f50364384a1

export type PrismaOrderWithItems = PrismaOrder & { orderItems: OrderItem[] }

export class PrismaOrdersMapper{
  static toDomain(raw : PrismaOrderWithItems) : Order {
    const order = Order.create({
      customerId : new UniqueEntityID(raw.customerId),
      totalAmount : raw.totalAmount,
      deliveryAddress : raw.deliveryAddress,
      status : raw.status,
      orderItems: raw.orderItems.map(PrismaOrderItemMapper.toDomain),
      updatedAt : raw.updatedAt,
      createdAt : raw.createdAt
    }, new UniqueEntityID(raw.id))

    return order
  }

  static toPrisma(order : Order) : Prisma.OrderUncheckedCreateInput  {
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: {
        create: order.orderItems.map(PrismaOrderItemMapper.toPrisma),
      },
  }
}}