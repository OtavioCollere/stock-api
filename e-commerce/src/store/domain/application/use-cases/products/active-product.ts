

import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { ProductsRepository } from "../../repositories/products-repository";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { UsersRepository } from "../../repositories/users-repository";
import { Product } from "@/store/domain/enterprise/entities/product";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

interface ActiveProductUseCaseRequest{
  productId : string
  updateByUserId : string
}

type ActiveProductUseCaseResponse = Either<
  ProductNotFoundError | UserNotFoundError,
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

    const userExists = await this.usersRepository.findById(updateByUserId);

    if(!userExists){
      return makeLeft(new UserNotFoundError())
    }

    product.activate(new UniqueEntityID(updateByUserId)) 

    await this.productsRepository.save(product);
  
    return makeRight({
      product
    })

  }
}