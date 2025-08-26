import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import type { ProductsRepository } from "../../repositories/products-repository";
import { Product } from "@/store/domain/enterprise/entities/product";
import { ProductAlreadyExistsError } from "@/store/core/errors/product-already-exists-error";
import { CategoryNotFoundError } from "@/store/core/errors/category-not-found-error";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import type { UsersRepository } from "../../repositories/users-repository";
import type { CategorysRepository } from "../../repositories/categorys-repository";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

interface RegisterProductUseCaseRequest{
  name : string
  productCode? : string
  description? : string
  quantity : number
  currentPrice: number
  categoryId:string
  createdByUserId : string
}

type RegisterProductUseCaseResponse = Either<
  ProductAlreadyExistsError | CategoryNotFoundError | UserNotFoundError ,
  {
    product : Product
  }
>

export class RegisterProductUseCase{

  constructor(
    private productsRepository : ProductsRepository,
    private usersRepository : UsersRepository,
    private categorysRepository : CategorysRepository
  ) {}

  async execute({name, productCode, description, quantity, currentPrice, categoryId, createdByUserId} : RegisterProductUseCaseRequest) : Promise<RegisterProductUseCaseResponse> {

    const slug = Product.createSlug(name);
    const productExists = await this.productsRepository.findBySlug(slug)

    if (productExists){
      return makeLeft(new ProductAlreadyExistsError())
    }

    const userExists = await this.usersRepository.findById(createdByUserId)
    
    if(!userExists) {
      return makeLeft(new UserNotFoundError())
    }

    const categoryExists = await this.categorysRepository.findById(categoryId)

    if (!categoryExists) {
      return makeLeft(new CategoryNotFoundError())
    }

    const product = Product.create({
       name, 
       productCode, 
       description,
       quantity,
       currentPrice,
       categoryId : new UniqueEntityID(categoryId),
       createdByUserId : new UniqueEntityID(createdByUserId)
    })

    await this.productsRepository.save(product);

    return makeRight({
      product
    })

  }
}