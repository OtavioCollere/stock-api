import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { UsersRepository } from "../../repositories/users-repository";
import type { ProductsRepository } from "../../repositories/products-repository";
import type { StockMovementRepository } from "../../repositories/stock-movement-repository";
import { makeLeft, type Either } from "@/store/core/either/either";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error";
import { InsufficientStockError } from "@/store/core/errors/insufficient-stock-error";

export interface DecreaseStockUseCaseRequest{
  productId : string
  sellerId : string
  type : 'IN' | 'OUT'
  reason? : string
  quantity : number
}

type DecreaseStockUseCaseResponse = Either<
UserNotFoundError | ProductNotFoundError | UserNotAuthorizedError | InsufficientStockError,
{
  stockMovementId : string
  productId : string
  type : 'IN' | 'OUT',
  quantity : number
}
>


@Injectable()
export class DecreaseStockUseCase{

  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private stockMovementRepository: StockMovementRepository,
  ) {}

  async execute({productId, sellerId, type, reason, quantity}: DecreaseStockUseCaseRequest): Promise<DecreaseStockUseCaseResponse>{

    const product = await this.productsRepository.findById(productId)

    if(!product){
      return makeLeft(new ProductNotFoundError())
    }

    const user = await this.usersRepository.findById(sellerId);

    if(!user) {
      return makeLeft(new UserNotFoundError())
    }

    if(user.role !== 'admin' && user.id.toString() !== sellerId)
    {
      return makeLeft(new UserNotAuthorizedError())
    }

    const stockQuantity = product.quantity;
    const isValidQuantity = quantity <= stockQuantity;

    if(!isValidQuantity)
    {
      return makeLeft(new InsufficientStockError())
    }



  }

}