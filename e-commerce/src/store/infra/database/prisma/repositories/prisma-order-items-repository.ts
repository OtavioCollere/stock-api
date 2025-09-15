import { OrderItemsRepository } from "@/store/domain/application/repositories/order-item-repository";
import { OrderItem } from "@/store/domain/enterprise/entities/order-item";
import { PrismaService } from "../../prisma.service";
import { PrismaOrderItemMapper } from "../mappers/prisma-order-item-mapper";

export class PrismaOrderItemsRepository implements OrderItemsRepository{
  constructor(
    private prismaService : PrismaService
  ) {}

  async create(orderItem: OrderItem): Promise<OrderItem> {
    await this.prismaService.orderItem.create({
      data : PrismaOrderItemMapper.toPrisma(orderItem)
    })

    return orderItem
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await this.prismaService.orderItem.deleteMany({
      where: {
        orderId: orderId,
      },
    })
  }
  

}