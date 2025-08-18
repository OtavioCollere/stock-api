import { makeLeft, makeRight, type Either } from "@/store/core/either/either"
import { User } from "../../../enterprise/entities/user"
import { EmailAlreadyExistsError } from "@/store/core/errors/email-already-exists-error"
import { UsersRepository } from "../../repositories/users-repository"
import { CpfAlreadyExistsError } from "@/store/core/errors/cpf-already-exists-error"
import { CpfValidator } from "../../gateways/cpf-validator"
import { CpfIsNotValidError } from "@/store/core/errors/cpf-is-not-valid-error"
import { HashGenerator } from "../../cryptography/hash-generator"

export interface RegisterUserUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  role: 'customer' | 'seller'
  phone: string
  birthDate: Date
}

export type RegisterUserUseCaseResponse = Either<
EmailAlreadyExistsError,
{
  user : User
}
>

export class RegisterUserUseCase{

  constructor(
    private usersRepository : UsersRepository,
    private cpfValidator : CpfValidator,
    private hashGenerator : HashGenerator
  ) {}

  async execute({name, cpf, email, password, role, phone, birthDate} : RegisterUserUseCaseRequest) : Promise<RegisterUserUseCaseResponse> {
    
    const emailExists = await this.usersRepository.findByEmail(email);

    if(emailExists)
    {
      return makeLeft(new EmailAlreadyExistsError())
    }

    const cpfExists = await this.usersRepository.findByCpf(cpf);

    if(cpfExists) 
    {
      return makeLeft(new CpfAlreadyExistsError())
    }

    // verificar esse await depois
    const isValidCPF = await this.cpfValidator.verifyCPF(cpf);

    if(!isValidCPF) {
      return makeLeft(new CpfIsNotValidError())
    }

    const hashedPassword = await this.hashGenerator.hash(password, 8);

    const user = User.create({
      name, 
      cpf, 
      email,
      password : hashedPassword, 
      phone,
      role,
      birthDate
    })

    await this.usersRepository.create(user);

    return makeRight({
      user
    });

  }
}