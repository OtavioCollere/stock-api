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


const registerUserBodySchema = z.object({
  name: z.string().min(1),
  cpf: z.string().regex(/^\d{11}$/, 'CPF must have exactly 11 digits'),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['customer', 'seller']),
  phone: z.string().regex(/^\d{11}$/, 'Phone number must have exactly 11 digits'),
  birthDate: z.coerce.date(), // aceita "2000-01-01"
});

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

@Controller('/users')
@ApiTags('Auth')
@Public()
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post()
  @UsePipes(new ZodPipe(registerUserBodySchema))
  @ApiBody({
    description: 'User Registration Data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, example: 'Otavio Takaki' },
        email: { type: 'string', format: 'email', example: 'otavio@email.com' },
        cpf: { type: 'string', pattern: '^[0-9]{11}$', example: '12354365782' },
        password: { type: 'string', example: '1234' },
        role: { type: 'string', enum: ['customer', 'seller'], example: 'customer' },
        phone: { type: 'string', pattern: '^[0-9]{11}$', example: '11987654321' },
        birthDate: { type: 'string', format: 'date', example: '2000-01-01' },
      },
      required: ['name', 'email', 'cpf', 'password', 'role', 'phone', 'birthDate'],
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: { id: { type: 'string', description: 'User ID' } },
          required: ['id'],
        },
      },
      example: { user: { id: 'a3f1b0f8-8c3e-4a9f-98a2-2a8c4e9c1234' } },
    },
  })
  @ApiConflictResponse({
    description: 'Email or CPF already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error (Zod) or invalid CPF from external validator',
    schema: {
      example: {
        statusCode: 400,
        message: ['CPF must have exactly 11 digits'],
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(201) // redundante, mas explícito
  async handle(@Body() body: RegisterUserBodySchema) {
    const { name, cpf, email, phone, role, birthDate, password } = body;

    const result = await this.registerUser.execute({
      name,
      cpf,
      email,
      phone,
      role,
      birthDate,
      password,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case EmailAlreadyExistsError:
        case CpfAlreadyExistsError:
          throw new ConflictException(error.message);
        case CpfIsNotValidError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const sub = unwrapEither(result).user.id.toString();
    return { user: { id: sub } };
  }
}
