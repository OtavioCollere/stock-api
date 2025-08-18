import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository'
import {it, describe, expect} from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/store/core/either/either'
import { makeUser } from 'test/factories/make-user'
import { AuthenticateUseCase } from '../authenticate'
import { HashComparer } from '../../../cryptography/hash-comparer'
import { Encrypter } from '../../../cryptography/encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'

describe("Authenticate User Unit Tests", () => {
  
  let inMemoryUsersRepository : InMemoryUsersRepository
  let fakeHasher : FakeHasher
  let encrypter : FakeEncrypter
  let sut : AuthenticateUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new AuthenticateUseCase(inMemoryUsersRepository, fakeHasher, encrypter)
  })

  it("should be able to authenticate user", async () => {

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : await fakeHasher.hash('1234')
    })

    const result = await sut.execute({
      email : 'otaviosk59@gmail.com',
      password : '1234',
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result))
    {
      expect(inMemoryUsersRepository.items[0].email).toEqual('otaviosk59@gmail.com')
      expect(inMemoryUsersRepository.items[0].password).toEqual('1234-hashed')
      expect(unwrapEither(result).user.name).toEqual('Otavio')
    }

  })  
  

})