import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { ProductsRepository } from "../../repositories/products-repository";
import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error";
import { InsufficientStockError } from "@/store/core/errors/insufficient-stock-error";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { DomainEvents } from "@/store/core/events/domain-events";

export interface DecreaseQuantityUseCaseRequest{
  productId : string
  sellerId : string
  reason? : string
  quantity : number
}

type DecreaseQuantityUseCaseResponse = Either<
UserNotFoundError | ProductNotFoundError | UserNotAuthorizedError | InsufficientStockError,
{
  productId : string
  sellerId : string
  type : 'OUT'
  quantity : number
  reason : string
}
>


@Injectable()
export class DecreaseQuantityUseCase{

  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({productId, sellerId, reason, quantity}: DecreaseQuantityUseCaseRequest): Promise<DecreaseQuantityUseCaseResponse>{

    const product = await this.productsRepository.findById(productId)

    if(!product){
      return makeLeft(new ProductNotFoundError())
    }

    const user = await this.usersRepository.findById(sellerId);

    if(!user) {
      return makeLeft(new UserNotFoundError())
    }

    if(user.role !== 'admin' && product.createdByUserId.toString() !== sellerId)
    {
      return makeLeft(new UserNotAuthorizedError())
    }

    const stockQuantity = product.quantity;
    const isValidQuantity = quantity <= stockQuantity;

    if(!isValidQuantity)
    {
      return makeLeft(new InsufficientStockError())
    }

    product.decreaseStock(new UniqueEntityID(productId) ,quantity, new UniqueEntityID(sellerId), reason);

    await this.productsRepository.save(product)

    DomainEvents.dispatchEventsForAggregate(product.id)

    return makeRight({
      productId : productId,
      sellerId : sellerId,
      type : 'OUT',
      quantity,
      reason : reason ?? 'No reason provided'
    })
  }

}