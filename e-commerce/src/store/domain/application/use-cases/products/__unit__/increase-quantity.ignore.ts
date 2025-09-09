import { it, describe, expect } from "vitest";
import { DecreaseQuantityUseCase } from "../decrease-quantity";
import { InMemoryProductsRepository } from "test/in-memory-repositories/in-memory-products-repository";
import { InMemoryUsersRepository } from "test/in-memory-repositories/in-memory-users-repository";
import { InMemoryStockMovementRepository } from "test/in-memory-repositories/in-memory-stock-movement-repository";
import { makeUser } from "test/factories/make-user";
import { makeProduct } from "test/factories/make-product";
import { isRight } from "@/store/core/either/either";
import { OnStockIncresead } from "../../../subscribers/on-stock-increased";
import { IncreaseQuantityUseCase } from "../increase-quantity";


describe(("Increase quantity unit tests"), () => {
  let sut : IncreaseQuantityUseCase
  let inMemoryProductsRepository : InMemoryProductsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository
  let inMemoryStockMovementRepository : InMemoryStockMovementRepository

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStockMovementRepository = new InMemoryStockMovementRepository();
    sut = new IncreaseQuantityUseCase(inMemoryUsersRepository, inMemoryProductsRepository)
  })

  it("Should be able to INCREASE quantity of a product", async () => {
    const onStockDecresead = new OnStockIncresead(inMemoryStockMovementRepository)

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
      reason : 'Fornecedor entregou a mercadoria'
    })

    expect(isRight(result)).toBeTruthy()    
    expect(inMemoryStockMovementRepository.items[0].quantity).toBe(10)
    expect(inMemoryStockMovementRepository.items[0].type).toBe('IN')
    expect(inMemoryProductsRepository.items[0].quantity).toBe(40)
  })

})
