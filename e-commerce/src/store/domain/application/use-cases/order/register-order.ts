import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { Order } from "@/store/domain/enterprise/entities/order";
import { OrderItem } from "@/store/domain/enterprise/entities/order-item";
import { OrdersRepository } from "../../repositories/orders-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { StockService } from "@/store/domain/enterprise/services/stock-service";
import { InsufficientStockForOrderItemError } from "@/store/core/errors/insufficient-stock-order-item-error";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

interface RegisterOrderUseCaseRequest {
    customerId: string
    orderItems: OrderItem[]
    totalAmount: number
    deliveryAddress: string
}

type RegisterOrderUseCaseResponse = Either<
UserNotFoundError,
{
  order : Order
}
>

export class RegisterOrderUseCase{

  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
    private stockService : StockService
  ){}

  async execute({customerId, orderItems, deliveryAddress}: RegisterOrderUseCaseRequest): Promise<RegisterOrderUseCaseResponse>{

    const user = await this.usersRepository.findById(customerId);

    if(!user){
      return makeLeft(new UserNotFoundError())
    }

    let totalAmount = 0;

    for (let item of orderItems){
      const availableStock = this.stockService.canBuy(item.productId.toString(), item.quantity);

      if(!availableStock) {
        return makeLeft(new InsufficientStockForOrderItemError(item.productId.toString(), item.quantity))
      }

      totalAmount += item.subTotal
    }


    const order = Order.create({
      customerId : new UniqueEntityID(customerId),
      orderItems,
      totalAmount,
      deliveryAddress
    })

    await this.ordersRepository.create(order)

    return makeRight({
      order
    })
  }
}