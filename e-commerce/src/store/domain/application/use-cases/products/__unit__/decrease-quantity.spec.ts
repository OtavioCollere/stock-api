import { it, describe, expect } from "vitest";
import { DecreaseQuantityUseCase } from "../decrease-quantity";
import { InMemoryProductsRepository } from "test/in-memory-repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "test/in-memory-repositories/in-memory-users-repository";
import { InMemoryStockMovementRepository } from "test/in-memory-repositories/in-memory-stock-movement-repository";
import { makeUser } from "test/factories/make-user";
import { makeProduct } from "test/factories/make-product";
import { isLeft, isRight, unwrapEither } from "@/store/core/either/either";
import { OnStockDecresead } from "../../../subscribers/on-stock-decreased";
import { ProductNotFoundError } from "@/store/core/errors/product-not-found-error";
import { UserNotFoundError } from "@/store/core/errors/user-not-found-error";
import { UserNotAuthorizedError } from "@/store/core/errors/user-not-authorized-error";
import { InsufficientStockError } from "@/store/core/errors/insufficient-stock-error";

describe(("Decrease quantity unit tests"), () => {
  let sut : DecreaseQuantityUseCase
  let inMemoryProductsRepository : InMemoryProductsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository
  let inMemoryStockMovementRepository : InMemoryStockMovementRepository

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStockMovementRepository = new InMemoryStockMovementRepository();
    sut = new DecreaseQuantityUseCase(inMemoryUsersRepository, inMemoryProductsRepository)
  })

  it("Should be able to decrease quantity of a product", async () => {
    const onStockDecresead = new OnStockDecresead(inMemoryStockMovementRepository)

    const user = makeUser({
      name : 'otavio'
    })
    inMemoryUsersRepository.items.push(user)

    const product = makeProduct({
      name : 'Desodorante Fedido',
      quantity : 30,
      createdByUserId : user.id
    })
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      sellerId : user.id.toString(),
      quantity : 10,
      reason : 'Mercadoria avariada por conta da chuva no estoque'
    })

    expect(isRight(result)).toBeTruthy()    
    expect(inMemoryStockMovementRepository.items[0].quantity).toBe(10)
    expect(inMemoryProductsRepository.items[0].quantity).toBe(20)
  })

  it("should not be able to decrease quantity when product does not exist", async () => {
    const user = makeUser({ name : 'otavio' })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      productId : 'non-existent-id',
      sellerId : user.id.toString(),
      quantity : 5,
      reason : 'teste'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(ProductNotFoundError)
  })

  it("should not be able to decrease quantity when user does not exist", async () => {
    const product = makeProduct({
      name : 'Produto X',
      quantity : 20
    })
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      sellerId : 'non-existent-id',
      quantity : 5,
      reason : 'teste'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
  })

  it("should not be able to decrease quantity when user is not authorized", async () => {
    const user = makeUser({ name : 'otavio' })
    const otherUser = makeUser({ name : 'joao' })
    inMemoryUsersRepository.items.push(user)
    inMemoryUsersRepository.items.push(otherUser)

    const product = makeProduct({
      name : 'Produto X',
      quantity : 20,
      createdByUserId : user.id
    })
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      sellerId : otherUser.id.toString(),
      quantity : 5,
      reason : 'teste'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotAuthorizedError)
  })

  it("should not be able to decrease quantity when stock is insufficient", async () => {
    const user = makeUser({ name : 'otavio' })
    inMemoryUsersRepository.items.push(user)

    const product = makeProduct({
      name : 'Produto X',
      quantity : 5,
      createdByUserId : user.id
    })
    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({
      productId : product.id.toString(),
      sellerId : user.id.toString(),
      quantity : 10, // maior que o estoque
      reason : 'teste'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(InsufficientStockError)
  })
})
