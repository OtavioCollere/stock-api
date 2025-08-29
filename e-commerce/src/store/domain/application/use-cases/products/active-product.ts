

import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { ProductsRepository } from "../../repositories/products-repository";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import { Product } from "@/store/domain/enterprise/entities/product";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error";

interface ActiveProductUseCaseRequest{
  productId : string
  updateByUserId : string
}

type ActiveProductUseCaseResponse = Either<
  ProductNotFoundError | UserNotFoundError | UserNotAuthorizedError,
  {
    product : Product
  }
>

export class ActiveProductUseCase{

  constructor(
    private productsRepository : ProductsRepository,
    private usersRepository : UsersRepository
  ) {}

  async execute({productId, updateByUserId
  } : ActiveProductUseCaseRequest) : Promise<ActiveProductUseCaseResponse> {

    const product = await this.productsRepository.findById(productId);

    if(!product){
      return makeLeft(new ProductNotFoundError())
    }

    const user = await this.usersRepository.findById(updateByUserId);

    if(!user){
      return makeLeft(new UserNotFoundError())
    }

    if(user.role != 'admin' && product.createdByUserId.toString() !== updateByUserId) {
      return makeLeft(new UserNotAuthorizedError())
    }

    product.activate(new UniqueEntityID(updateByUserId)) 

    await this.productsRepository.save(product);
  
    return makeRight({
      product
    })

  }
}