import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { ZodPipe } from '../../pipes/zod-validation-pipe';
import { isLeft, unwrapEither } from '@/store/core/either/either';
import { RegisterUserUseCase } from '@/store/domain/application/use-cases/users/register-user';
import { EmailAlreadyExistsError } from '@/store/core/errors/email-already-exists-error';
import { CpfIsNotValidError } from '@/store/core/errors/cpf-is-not-valid-error';
import { CpfAlreadyExistsError } from '@/store/core/errors/cpf-already-exists-error';
import { Public } from 'src/store/infra/auth/public';
import type { RegisterOrderUseCase } from '@/store/domain/application/use-cases/order/register-order';


const registerOrderBodySchema = z.object({

});

type RegisterOrderBodySchema = z.infer<typeof registerOrderBodySchema>;

@Controller('/orders')
@ApiTags('Orders')
@Public()
export class RegisterUserController {
  constructor(private registerOrder: RegisterOrderUseCase) {}

  @Post()
  @UsePipes(new ZodPipe(registerOrderBodySchema))

  @HttpCode(201) // redundante, mas explícito
  async handle(@Body() body: RegisterOrderBodySchema) {
    const {  } = body;

    const result = await this.registerOrder.execute({
    
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case EmailAlreadyExistsError:

        default:
          throw new BadRequestException();
      }
    }


  }
}
