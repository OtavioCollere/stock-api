import { InMemoryProductsRepository } from "test/in-memory-repositories/in-memory-products-repository"
import { ArchiveProductUseCase } from "../archive-product"
import { InMemoryUsersRepository } from "test/in-memory-repositories/in-memory-users-repository"
import { makeProduct } from "test/factories/make-product"
import { makeUser } from "test/factories/make-user"
import { isLeft, isRight, unwrapEither } from "@/store/core/either/either"
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error"
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error"
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error"
import { ProductMustBeActiveError } from "@/store/core/errors/product-must-be-active-error"

describe("Archive Product Unit Tests", () => {

  let sut: ArchiveProductUseCase
  let inMemoryProductsRepository : InMemoryProductsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ArchiveProductUseCase(inMemoryProductsRepository, inMemoryUsersRepository)
  })

  it("should be able to archive product by the creator of it", async () => {
    
    const user = makeUser({
      email : 'otavio@email.com'
    })
    inMemoryUsersRepository.items.push(user)

    const product = makeProduct({
      createdByUserId : user.id,
      status: "active"
    });
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      updateByUserId : user.id.toString()
    })    

    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(inMemoryProductsRepository.items[0].status).toBe('archived')
    }

  })


  it("should be able to archive product by admin", async () => {
    
    const user = makeUser({
      email : 'otavio@email.com',
      role : 'admin'
    })
    inMemoryUsersRepository.items.push(user)

    const product = makeProduct({
      status: "active"
    });
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      updateByUserId : user.id.toString()
    })    

    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(inMemoryProductsRepository.items[0].status).toBe('archived')
    }

  })

  it('should not be able to archive when product not exists ', async () => {
    const result = await sut.execute({
      productId : '',
      updateByUserId : ''
    })   

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(ProductNotFoundError)
  })

  it('should not be able to archive when user not exists', async () => {
    const product = makeProduct({
      status: "active"
    });
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      updateByUserId : ''
    })  

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
  })


  it('should not be able to archive when user is not admin or user who created the product ', async () => {
    
    const user = makeUser({
      email : 'otavio@email.com',
      role : 'seller'
    })
    inMemoryUsersRepository.items.push(user)

    const product = makeProduct({
      status: "active"
    });
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      updateByUserId : user.id.toString()
    })   

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotAuthorizedError)
  })

  it('should not be able to archive when product is not active', async () => {
    const user = makeUser({
      email : 'otavio@email.com',
      role : 'admin'
    })
    inMemoryUsersRepository.items.push(user)

    const product = makeProduct({
      status: "archived"
    });
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      updateByUserId : user.id.toString()
    })   

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(ProductMustBeActiveError)
  })

})
