import type { Either } from "@/store/core/either/either";
import type { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import type { Order } from "@/store/domain/enterprise/entities/order";
import type { OrderItem } from "@/store/domain/enterprise/entities/order-item";

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

}