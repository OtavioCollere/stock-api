import type { Either } from "@/store/core/either/either"
import type { User } from "../../enterprise/entities/user"
import type { EmailAlreadyExistsError } from "@/store/core/errors/email-already-exists-error"

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

  async execute({name, cpf, email, password, role, phone, birthDate} : RegisterUserUseCaseRequest) : RegisterUserUseCaseResponse {
    
  }
}