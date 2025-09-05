import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { ProductsRepository } from "../../repositories/products-repository";
import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error";
import { InsufficientStockError } from "@/store/core/errors/insufficient-stock-error";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

export interface IncreaseQuantityUseCaseRequest{
  productId : string
  sellerId : string
  reason? : string
  quantity : number
}

type IncreaseQuantityUseCaseResponse = Either<
UserNotFoundError | ProductNotFoundError | UserNotAuthorizedError | InsufficientStockError,
{
  productId : string
  sellerId : string
  type : 'IN'
  quantity : number
  reason : string
}
>


@Injectable()
export class IncreaseQuantityUseCase{

  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({productId, sellerId, reason, quantity}: IncreaseQuantityUseCaseRequest): Promise<IncreaseQuantityUseCaseResponse>{

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

    product.increaseStock(new UniqueEntityID(productId) ,quantity, new UniqueEntityID(sellerId), reason);

    await this.productsRepository.save(product)

    return makeRight({
      productId : productId,
      sellerId : sellerId,
      type : 'IN',
      quantity,
      reason : reason ?? 'No reason provided'
    })
    
  }

}