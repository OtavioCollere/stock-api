
import {it, describe, expect} from 'vitest'
import { InMemoryProductsRepository } from 'test/in-memory-repositories/in-memory-products-repository'
import { RegisterProductUseCase } from '../register-product'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository'

import { makeProduct } from 'test/factories/make-product'
import { makeUser } from 'test/factories/make-user'
import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/store/core/entities/unique-entity-id'
import { isLeft, isRight, unwrapEither } from '@/store/core/either/either'
import { ProductAlreadyExistsError } from '@/store/core/errors/product-already-exists-error'
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error'
import { CategoryNotFoundError } from '@/store/core/errors/category-not-found-error'
import { InMemoryCategoriesRepository } from 'test/in-memory-repositories/in-memory-categorys-repository'

describe("Register Product Unit Tests", () => {
  
  let inMemoryProductsRepository : InMemoryProductsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository
  let inMemoryCategoriesRepositorys : InMemoryCategoriesRepository
  let sut : RegisterProductUseCase

  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCategoriesRepositorys = new InMemoryCategoriesRepository();
    sut = new RegisterProductUseCase(inMemoryProductsRepository, inMemoryUsersRepository, inMemoryCategoriesRepositorys)
  })

  it("should be able to register product", async () => {

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : '1234'
    });

    const category = makeCategory({createdBy : user.id})

    inMemoryUsersRepository.items.push(user)
    inMemoryCategoriesRepositorys.items.push(category)

    const result = await sut.execute({
      name : 'Produto X',
      description : 'Produto x com durabilidade',
      productCode : 'AS360',
      quantity : 2,
      currentPrice : 100,
      categoryId : category.id.toString(),
      createdByUserId : user.id.toString()
    })

    expect(isRight(result))
    if(isRight(result)){
      expect(inMemoryProductsRepository.items[0].name).toEqual('Produto X')
      expect(inMemoryProductsRepository.items[0].categoryId).toEqual(unwrapEither(result).product.categoryId)
    }

  })  

  it('should not be able to register a product when product already exists', async () => {
    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : '1234'
    });

    const category = makeCategory({createdBy : user.id})
    const product = makeProduct({
      name : 'Produto X',
      description : 'Produto x com durabilidade',
      productCode : 'AS360',
      quantity : 2,
      currentPrice : 100,
      categoryId : category.id,
      createdByUserId : user.id
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryCategoriesRepositorys.items.push(category)
    inMemoryProductsRepository.items.push(product)
   
    const result = await sut.execute({
      name : 'Produto X',
      description : 'Produto x com durabilidade',
      productCode : 'AS360',
      quantity : 2,
      currentPrice : 100,
      categoryId : 'non-existent-id',
      createdByUserId : user.id.toString()
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(ProductAlreadyExistsError)

  })

  it('should not be able when user not exists', async () => {

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : '1234'
    });

    const category = makeCategory({createdBy : user.id})
    inMemoryCategoriesRepositorys.items.push(category)

    const result = await sut.execute({
      name : 'Produto X',
      description : 'Produto x com durabilidade',
      productCode : 'AS360',
      quantity : 2,
      currentPrice : 100,
      categoryId : category.id.toString(),
      createdByUserId : 'non-existent-id'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)

  })


  it('should not be able when category not exists', async () => {

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : '1234'
    });
    inMemoryUsersRepository.items.push(user)

    const category = makeCategory({createdBy : user.id})
    inMemoryCategoriesRepositorys.items.push(category)

    const result = await sut.execute({
      name : 'Produto X',
      description : 'Produto x com durabilidade',
      productCode : 'AS360',
      quantity : 2,
      currentPrice : 100,
      categoryId : 'non-exist',
      createdByUserId : user.id.toString()
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(CategoryNotFoundError)

  })



})