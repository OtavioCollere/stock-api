


import {it, describe, expect} from 'vitest'
import { InMemoryProductsRepository } from 'test/in-memory-repositories/in-memory-products-repository'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository'

import { makeUser } from 'test/factories/make-user'
import { makeCategory } from 'test/factories/make-category'
import { isRight, unwrapEither } from '@/store/core/either/either'
import { InMemoryCategoriesRepository } from 'test/in-memory-repositories/in-memory-categorys-repository'
import { InMemoryOrdersRepository } from 'test/in-memory-repositories/in-memory-orders-repository'
import { InMemoryOrderItemsRepository } from 'test/in-memory-repositories/in-memory-order-items-repository'
import { RegisterOrderUseCase } from '../register-order'
import { StockService } from '@/store/domain/enterprise/services/stock-service'
import { makeProduct } from 'test/factories/make-product'
import { OrderItem } from '@/store/domain/enterprise/entities/order-item'

describe("Register Order Unit Tests", () => {
  
  let inMemoryOrdersRepository : InMemoryOrdersRepository
  let inMemoryOrderItemsRepository : InMemoryOrderItemsRepository
  let inMemoryProductsRepository : InMemoryProductsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository
  let inMemoryCategoriesRepositorys : InMemoryCategoriesRepository
  let stockService : StockService
  let sut : RegisterOrderUseCase

  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryOrderItemsRepository);
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCategoriesRepositorys = new InMemoryCategoriesRepository();
    stockService = new StockService(inMemoryProductsRepository)
    
    sut = new RegisterOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
      stockService
    )

  })

  it("should be able to register a order", async () => {

    const customer = makeUser({
      email : 'eunice@gmail.com',
      password : '1234'
    });

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : '1234'
    });

    const category = makeCategory({createdBy : user.id})

    inMemoryUsersRepository.items.push(user)
    inMemoryUsersRepository.items.push(customer)
    inMemoryCategoriesRepositorys.items.push(category)

    const product = makeProduct({
      name : 'Geladeira',
      createdByUserId : user.id
    })

    const orderItems = [
      new OrderItem({
          productId: product.id,
          quantity: 10,
          unitPrice: 1000
      })
    ]

    const result = await sut.execute({
      customerId : customer.id.toString(),
      deliveryAddress : 'Rua silva',
      orderItems : orderItems,
     })

    expect(isRight(result))
    if(isRight(result)){
   
    }

  })  


  // it('should not be able when user not exists', async () => {

   
  // })


  // it('should not be able when category not exists', async () => {

  // })



})