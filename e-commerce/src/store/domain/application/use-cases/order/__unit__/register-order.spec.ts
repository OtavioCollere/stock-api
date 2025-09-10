


import {it, describe, expect} from 'vitest'
import { InMemoryProductsRepository } from 'test/in-memory-repositories/in-memory-products-repository'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository'

import { makeUser } from 'test/factories/make-user'
import { isLeft, isRight, unwrapEither } from '@/store/core/either/either'
import { InMemoryCategoriesRepository } from 'test/in-memory-repositories/in-memory-categorys-repository'
import { InMemoryOrdersRepository } from 'test/in-memory-repositories/in-memory-orders-repository'
import { InMemoryOrderItemsRepository } from 'test/in-memory-repositories/in-memory-order-items-repository'
import { RegisterOrderUseCase } from '../register-order'
import { makeProduct } from 'test/factories/make-product'
import { OrderItem } from '@/store/domain/enterprise/entities/order-item'
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error'
import { UniqueEntityID } from '@/store/core/entities/unique-entity-id'
import { ProductNotFoundError } from '@/store/core/errors/product-not-found-error'
import { InsufficientStockForOrderItemError } from '@/store/core/errors/insufficient-stock-order-item-error'

describe("Register Order Unit Tests", () => {
  
  let inMemoryOrdersRepository : InMemoryOrdersRepository
  let inMemoryOrderItemsRepository : InMemoryOrderItemsRepository
  let inMemoryProductsRepository : InMemoryProductsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository
  let inMemoryCategoriesRepositorys : InMemoryCategoriesRepository
  let sut : RegisterOrderUseCase

  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(inMemoryOrderItemsRepository);
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCategoriesRepositorys = new InMemoryCategoriesRepository();
    
    sut = new RegisterOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
      inMemoryProductsRepository
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

    inMemoryUsersRepository.items.push(user)
    inMemoryUsersRepository.items.push(customer)

    const orderItems = []
    for (let c = 1; c <= 10 ; c++) {

      let product = makeProduct({
        name : `Produto ${c}`,
        quantity : 20,
        createdByUserId : user.id
      });
      inMemoryProductsRepository.items.push(product)

    orderItems.push({
      productId: product.id.toString(),
      quantity: 10,
      unitPrice: 1000
    })
 
    }

    const result = await sut.execute({
      customerId : customer.id.toString(),
      deliveryAddress : 'Rua silva 123',
      orderItems : orderItems,
     })
     
    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(inMemoryOrderItemsRepository.items.length).toEqual(10)
      expect(inMemoryOrdersRepository.items[0].totalAmount).toEqual(100000)
      expect(inMemoryOrdersRepository.items[0].status).toEqual('PENDING')
    }

  })  

  it('should not be able to create an order when customer does not exists', async () => {
    
    const result = await sut.execute({
      customerId : 'non-existent-id',
      deliveryAddress : 'Rua silva 123',
      orderItems : [],
     })

     expect(isLeft(result)).toBeTruthy()
     expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create an order when a product in the order items does not exists', async () => {

    const customer = makeUser({
      email : 'eunice@gmail.com',
      password : '1234'
    });

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : '1234'
    });

    inMemoryUsersRepository.items.push(user)
    inMemoryUsersRepository.items.push(customer)

    const orderItems = []

    orderItems.push({
      productId: 'fakeId', // string crua
      quantity: 10,
      unitPrice: 1000
    })

    const result = await sut.execute({
      customerId : customer.id.toString(),
      deliveryAddress : 'Rua silva 123',
      orderItems : orderItems,
     })

     expect(isLeft(result)).toBeTruthy()
     expect(unwrapEither(result)).toBeInstanceOf(ProductNotFoundError)
  })

  it('should not be able to create an order when the stock for a product in the order items is insufficient', async () => {
      const customer = makeUser({
        email : 'eunice@gmail.com',
        password : '1234'
      });
  
      const user = makeUser({
        email : 'otaviosk59@gmail.com',
        password : '1234'
      });
    
      inMemoryUsersRepository.items.push(user)
      inMemoryUsersRepository.items.push(customer)
  
      let product = makeProduct({
        name : `Produto 1`,
        quantity : 20,
        createdByUserId : user.id
      });
      inMemoryProductsRepository.items.push(product)
  
      const orderItems = []
      orderItems.push({
        productId: product.id.toString(),
        quantity: 30,
        unitPrice: 1000
      })
  
      const result = await sut.execute({
        customerId : customer.id.toString(),
        deliveryAddress : 'Rua silva 123',
        orderItems : orderItems,
       })
  
       expect(isLeft(result)).toBeTruthy()
       expect(unwrapEither(result)).toBeInstanceOf(InsufficientStockForOrderItemError)
  })

})