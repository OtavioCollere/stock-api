import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { Order } from "@/store/domain/enterprise/entities/order";
import { OrderItem } from "@/store/domain/enterprise/entities/order-item";
import { OrdersRepository } from "../../repositories/orders-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { InsufficientStockForOrderItemError } from "@/store/core/errors/insufficient-stock-order-item-error";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { OrderNotFoundError } from "@/store/core/errors/order-not-found-error";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { ProductsRepository } from "../../repositories/products-repository";

interface RegisterOrderUseCaseRequest {
    customerId: string
    orderItems: OrderItem[]
    deliveryAddress: string
}

type RegisterOrderUseCaseResponse = Either<
 OrderNotFoundError | UserNotFoundError | ProductNotFoundError,
{
  order : Order
}
>

export class RegisterOrderUseCase{

  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository
  ){}

  async execute({customerId, orderItems, deliveryAddress}: RegisterOrderUseCaseRequest): Promise<RegisterOrderUseCaseResponse>{

    const user = await this.usersRepository.findById(customerId);

    if(!user){
      return makeLeft(new UserNotFoundError())
    }

    let totalAmount = 0;

    const orderId = new UniqueEntityID()
    orderItems = orderItems.map(item =>
      OrderItem.create({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    )

    for (let item of orderItems){

      let product = await this.productsRepository.findById(item.productId.toString())

      if (!product){
        return makeLeft(new ProductNotFoundError())
      }

      let availableStock = product.quantity >= item.quantity

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