import { BadRequestException, Body, ConflictException, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodPipe } from "../../pipes/zod-validation-pipe";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { isLeft, unwrapEither } from "@/store/core/either/either";
import { AuthenticateUseCase } from "@/store/domain/application/use-cases/users/authenticate";
import { WrongCredentialsError } from "@/store/core/errors/wrong-credentials-error";

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@ApiTags('Auth')
export class AuthenticateController{

  constructor(private authenticateUser : AuthenticateUseCase ) {}

  @ApiOperation({summary : 'Authenticate a user with JWT'})
  @Post()
  @UsePipes(new ZodPipe(authenticateBodySchema))

  @ApiBody({
    description : 'User Registration Data', 
    schema : {
      type : 'object',
      properties : {
        email: { type: 'string', format: 'email' },  
        password: { type: 'string', minLength: 20 },          
      }, 
      required : ['email', 'password']
    }
  })

  @ApiResponse({
    status : 200,
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

  async handle(@Body() body : AuthenticateBodySchema) {

    const { email, password } = body;

     const result = await this.authenticateUser.execute({
      email,
      password
     })

     if(isLeft(result))
     {
      const error = unwrapEither(result)

      switch(error.constructor)
      {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default :
          throw new BadRequestException()      
      }

     }

     const {access_token, refresh_token} = unwrapEither(result);

     return {
      access_token,
      refresh_token
     }

  }
}