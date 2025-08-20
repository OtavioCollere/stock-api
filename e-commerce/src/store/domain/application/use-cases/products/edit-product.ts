import { makeLeft, makeRight, type Either } from "@/store/core/either/either";
import type { ProductsRepository } from "../../repositories/products-repository";
import { ProductAlreadyExistsError } from "@/store/core/errors/product-already-exists-error";
import { CategoryNotFoundError } from "@/store/core/errors/category-not-found-error";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { Product } from "@/store/domain/enterprise/entities/product";
import type { UsersRepository } from "../../repositories/users-repository";
import type { CategorysRepository } from "../../repositories/categorys-repository";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

interface EditProductUseCaseRequest{
  productId : string
  updatedByUserId : string
  name? : string
  productCode? : string
  description? : string
  quantity? : number
  currentPrice? : number
  categoryId? : string
}

type EditProductUseCaseResponse = Either<
  ProductAlreadyExistsError |  CategoryNotFoundError |  UserNotFoundError,
  {
    product: Product
  }
>

export class EditProductUseCase{

  constructor(
    private productsRepository : ProductsRepository,
    private usersRepository:  UsersRepository,
    private categoryExists : CategorysRepository
  ) {}

  async execute({productId, name, productCode, description, quantity, currentPrice, categoryId, updatedByUserId} : EditProductUseCaseRequest) : Promise<EditProductUseCaseResponse> {
    
    const product = await this.productsRepository.findById(productId)

    if(!product){
      return makeLeft(new ProductNotFoundError())
    }

    const userExists = await this.usersRepository.findById(updatedByUserId)

    if(!userExists) {
      return makeLeft(new UserNotFoundError())
    }

    if(name) {
      const slug = Product.createSlug(name);

      if(slug) {
        return makeLeft(new ProductAlreadyExistsError()) 
      }

      product.name = name;
    }

    if(categoryId){

      const categoryExists = await this.categoryExists.findById(categoryId)

      if(categoryExists) {
        return makeLeft(new CategoryNotFoundError())
      }

      product.categoryId = new UniqueEntityID(categoryId)

    }

    if (productCode) product.productCode = productCode
    if (description) product.description = description
    if (quantity) product.quantity = quantity
    if (currentPrice) product.currentPrice = currentPrice

    await this.productsRepository.save(product)

    return makeRight({
      product
    })

  }
}