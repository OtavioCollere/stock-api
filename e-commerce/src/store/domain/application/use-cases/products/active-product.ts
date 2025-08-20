

import type { Either } from "@/store/core/either/either";
import type { ProductsRepository } from "../../repositories/products-repository";
import type { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import type { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import type { UsersRepository } from "../../repositories/users-repository";

interface ActiveProductUseCaseRequest{
  productId : string
  updateByUserId : string
}

type ActiveProductUseCaseResponse = Either<
  ProductNotFoundError | UserNotFoundError
>

export class ActiveProductUseCase{

  constructor(
    private productsRepository : ProductsRepository
    private usersRepository : UsersRepository
  ) {}

  async execute({productId, updateByUserId
  } : ActiveProductUseCaseRequest) : Promise<ActiveProductUseCaseResponse> {

    const product = await this.

  }
}