import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeCpfValidator } from 'test/gateways/fake-cpf-validator'
import { InMemoryUsersRepository } from 'test/in-memory-repositories/in-memory-users-repository'
import {it, describe, expect} from 'vitest'
import { RegisterUserUseCase } from '../register-user'
import { isLeft, isRight, unwrapEither } from '@/store/core/either/either'
import { makeUser } from 'test/factories/make-user'
import { EmailAlreadyExistsError } from '@/store/core/errors/email-already-exists-error'
import { CpfAlreadyExistsError } from '@/store/core/errors/cpf-already-exists-error'
import { CpfIsNotValidError } from '@/store/core/errors/cpf-is-not-valid-error'

describe("Register User Unit Tests", () => {
  
  let inMemoryUsersRepository : InMemoryUsersRepository
  let fakeCpfValidator : FakeCpfValidator
  let fakeHasher : FakeHasher
  let sut : RegisterUserUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeCpfValidator = new FakeCpfValidator();
    fakeHasher = new FakeHasher();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeCpfValidator, fakeHasher)
  })

  it("should be able to register user", async () => {

    const result = await sut.execute({
      name : 'Otavio',
      email : 'otaviosk59@gmail.com',
      password : '1234',
      birthDate : new Date(),
      role : 'customer',
      cpf : '55573251655',
      phone : '41991225828'
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result))
    {
      expect(inMemoryUsersRepository.items[0].email).toEqual('otaviosk59@gmail.com')
      expect(inMemoryUsersRepository.items[0].password).toEqual('1234-hashed')
      expect(unwrapEither(result).user.name).toEqual('Otavio')
    }

  })  

  it('should not be able to register a user with an existing email', async () => {

    const user = makeUser({
      email : 'otaviosk59@gmail.com'
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      name : 'Otavio',
      email : 'otaviosk59@gmail.com',
      password : '1234',
      birthDate : new Date(),
      role : 'customer',
      cpf : '55573251655',
      phone : '41991225828'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should not be able to register a user with an existing CPF', async () => {

    const user = makeUser({
      email : 'otavioskdadada59@gmail.com',
      cpf : '55573251655'
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      name : 'Otavio',
      email : 'otaviosk59@gmail.com',
      password : '1234',
      birthDate : new Date(),
      role : 'customer',
      cpf : '55573251655',
      phone : '41991225828'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(CpfAlreadyExistsError)
  })

  it('should not be able to register with invalid CPF', async () => {
    fakeCpfValidator = new FakeCpfValidator(false)
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeCpfValidator, fakeHasher)

    const result = await sut.execute({
      name : 'Otavio',
      email : 'otaviosk59@gmail.com',
      password : '1234',
      birthDate : new Date(),
      role : 'customer',
      cpf : '55573251655',
      phone : '41991225828'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(CpfIsNotValidError)
  })
  

})