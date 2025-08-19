import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository'
import {it, describe, expect} from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/store/core/either/either'
import { makeUser } from 'test/factories/make-user'
import { AuthenticateUseCase } from '../authenticate'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

describe("Authenticate User Unit Tests", () => {
  
  let inMemoryUsersRepository : InMemoryUsersRepository
  let fakeHasher : FakeHasher
  let fakeEncrypter : FakeEncrypter
  let sut : AuthenticateUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
  })

  it("should be able to authenticate user", async () => {

    const user = makeUser({
      email : 'otaviosk59@gmail.com',
      password : await fakeHasher.hash('1234', 8)
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email : 'otaviosk59@gmail.com',
      password : '1234',
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result))
    {
      expect(unwrapEither(result)).toEqual({
        access_token : expect.any(String),
        refresh_token : expect.any(String)
      })
    }

  })  
  

})