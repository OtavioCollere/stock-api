import { OrdersRepository } from "@/store/domain/application/repositories/orders-repository";
import { Order } from "@/store/domain/enterprise/entities/order";
import { PrismaService } from "../../prisma.service";
import { PrismaOrdersMapper } from "../mappers/prisma-orders-mapper";
<<<<<<< HEAD
import { DomainEvents } from "@/store/core/events/domain-events";
=======
>>>>>>> efe5248c489bd7aaf11ea999df1b3f50364384a1

export class PrismaOrdersRepository implements OrdersRepository{
  constructor(
    private prismaService : PrismaService
  ) {}

  async create(order: Order): Promise<Order> {
    const data = PrismaOrdersMapper.toPrisma(order)
  
    await this.prismaService.order.create({ data })
<<<<<<< HEAD

    DomainEvents.dispatchEventsForAggregate(order.id)
=======
>>>>>>> efe5248c489bd7aaf11ea999df1b3f50364384a1
  
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