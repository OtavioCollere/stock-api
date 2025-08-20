import { makeLeft, makeRight, type Either } from "@/store/core/either/either"
import { User } from "../../../enterprise/entities/user"
import { EmailAlreadyExistsError } from "@/store/core/errors/email-already-exists-error"
import { UsersRepository } from "../../repositories/users-repository"
import { CpfAlreadyExistsError } from "@/store/core/errors/cpf-already-exists-error"
import { CpfValidator } from "../../gateways/cpf-validator"
import { CpfIsNotValidError } from "@/store/core/errors/cpf-is-not-valid-error"
import { HashGenerator } from "../../cryptography/hash-generator"
import { Injectable } from "@nestjs/common"
import type { Encrypter } from "../../cryptography/encrypter"
import { WrongCredentialsError } from "@/store/core/errors/wrong-credentials-error"

export interface SendConfirmationEmailUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
  role: 'customer' | 'seller'
  phone: string
  birthDate: Date
}

export type SendConfirmationEmailUseCaseResponse = Either<
EmailAlreadyExistsError,
{
  user : User
}
>

@Injectable()
export class SendConfirmationEmailUseCase{

  constructor(
    private usersRepository : UsersRepository,
    private hashGenerator : HashGenerator,
    private encrypter : Encrypter
  ) {}

  async execute({name, cpf, email, password, role, phone, birthDate} : SendConfirmationEmailUseCaseRequest) : Promise<SendConfirmationEmailUseCaseResponse> {

    const user = await this.usersRepository.findByEmail(email);

    if(!user)
    {
      return makeLeft(new WrongCredentialsError())
    }

    jwt.sign(
      {
        user: _.pick(user, 'id'),
      },
      EMAIL_SECRET,
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        const url = `http://localhost:3000/confirmation/${emailToken}`;

        transporter.sendMail({
          to: args.email,
          subject: 'Confirm Email',
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        });
      },
    );

  }
}