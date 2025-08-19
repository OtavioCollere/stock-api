import { RegisterUserUseCase } from "@/store/domain/application/use-cases/users/register-user";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodPipe } from "../../pipes/zod-validation-pipe";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { isLeft, unwrapEither } from "@/store/core/either/either";
import { EmailAlreadyExistsError } from "@/store/core/errors/email-already-exists-error";
import { CpfIsNotValidError } from "@/store/core/errors/cpf-is-not-valid-error";

const registerUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11, "CPF must have exactly 11 digits"),
  email: z.email(),
  password: z.string(),
  role: z.enum(["customer", "seller"]),
  phone: z.string().length(11, "Phone number must have exactly 11 digits"),
  birthDate: z.coerce.date(), // aceita string (ex: "2000-01-01") e converte p/ Date
});

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Controller('/users')
@ApiTags('Auth')
export class RegisterUserController{

  constructor(private registerUser : RegisterUserUseCase ) {}

  @ApiOperation({summary : 'Register a new user'})
  @Post()
  @UsePipes(new ZodPipe(registerUserBodySchema))

  @ApiBody({
    description : 'User Registration Data', 
    schema : {
      type : 'object',
      properties : {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        cpf: { type: 'string', pattern: '^[0-9]{11}$' },       
        password: { type: 'string', minLength: 20 },          
        role: { type: 'string', enum: ['customer', 'seller'] },
        phone: { type: 'string', pattern: '^[0-9]{11}$' },      
        birthDate: { type: 'string', format: 'date' }  
      }, 
      required : ['name', 'email', 'password', 'role', 'phone', 'birthDate']
    }
  })

  @ApiResponse({
    status : 201,
    description: 'User created sucessfully',
    schema : {
      example : {
        user : {id : 'uuid'}
      }
    }
  })

  @ApiResponse({
    status : 409,
    description: 'Email already exists ( Conflict Exception )',
  })

  @ApiResponse({
    status: 400,
    description: 'CPF is not valid - external API returned false',
  })

  @HttpCode(201)
  async handle(@Body() body : RegisterUserBodySchema) {

    const { name, cpf, email, phone, role, birthDate, password
     } = body;

     const result = await this.registerUser.execute({
      name,
      cpf,
      email,
      phone,
      role,
      birthDate,
      password
     })

     if(isLeft(result))
     {
      const error = unwrapEither(result)

      switch(error.constructor)
      {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message)
        case CpfIsNotValidError:
          throw new BadRequestException(error.message)
        default :
          throw new BadRequestException()      
      }

     }

     const sub = unwrapEither(result).user.id.toString()

     return {
      user: { id : sub}
     }

  }
}