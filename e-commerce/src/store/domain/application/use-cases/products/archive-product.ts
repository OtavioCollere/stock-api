import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import { ProductsRepository } from "../../repositories/products-repository";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { ProductMustBeActiveError } from "@/store/core/errors/product-must-be-active-error";
import { Product } from "@/store/domain/enterprise/entities/product";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error";
import { UsersRepository } from "../../repositories/users-repository";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface ArchiveProductUseCaseRequest{
  productId : string
  updateByUserId : string
}

type ArchiveProductUseCaseResponse = Either<
 ProductNotFoundError | ProductMustBeActiveError | UserNotFoundError | UserNotAuthorizedError,
{
  product : Product
}
>

@Injectable()
export class ArchiveProductUseCase{

  constructor(
    private productsRepository : ProductsRepository,
    private usersRepository : UsersRepository
  ) {}

  async execute({productId, updateByUserId} : ArchiveProductUseCaseRequest) : Promise<ArchiveProductUseCaseResponse> {
      const product = await this.productsRepository.findById(productId);

      if(!product) {
        return makeLeft(new ProductNotFoundError())
      }

      const user = await this.usersRepository.findById(updateByUserId);

      if(!user) {
        return makeLeft(new UserNotFoundError())
      }

      const userIsNotAuthorized = user.role !== 'admin' && product.createdByUserId.toString() !== updateByUserId

      if(userIsNotAuthorized){
        return makeLeft(new UserNotAuthorizedError())
      }

      if(product.status !== 'active')
      {
        return makeLeft(new ProductMustBeActiveError())
      }

      product.archive(new UniqueEntityID(updateByUserId));
      
      await this.productsRepository.save(product)

      return makeRight({
        product 
      })
  }
}