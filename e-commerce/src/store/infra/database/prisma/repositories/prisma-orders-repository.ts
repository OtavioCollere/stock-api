import { OrdersRepository } from "@/store/domain/application/repositories/orders-repository";
import { Order } from "@/store/domain/enterprise/entities/order";
import { PrismaService } from "../../prisma.service";
import { PrismaOrdersMapper } from "../mappers/prisma-orders-mapper";
import { DomainEvents } from "@/store/core/events/domain-events";

export class PrismaOrdersRepository implements OrdersRepository{
  constructor(
    private prismaService : PrismaService
  ) {}

  async create(order: Order): Promise<Order> {
    const data = PrismaOrdersMapper.toPrisma(order)
  
    await this.prismaService.order.create({ data })

    DomainEvents.dispatchEventsForAggregate(order.id)
  
    return order
  }

  async save(order: Order): Promise<Order> {
    const data = PrismaOrdersMapper.toPrisma(order)

    this.prismaService.order.update({
      where : {
        id : data.id
      },
      data 
    })

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({
      where : {
        id : id
      },
      include : {orderItems : true}
    })

    if (!order) return null

    return PrismaOrdersMapper.toDomain(order);
  }

}