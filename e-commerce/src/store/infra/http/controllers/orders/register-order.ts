import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { ZodPipe } from '../../pipes/zod-validation-pipe';
import { isLeft, unwrapEither } from '@/store/core/either/either';
import { Public } from 'src/store/infra/auth/public';
import { RegisterOrderUseCase } from '@/store/domain/application/use-cases/order/register-order';
import { OrderNotFoundError } from '@/store/core/errors/order-not-found-error';
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error';
import { ProductNotFoundError } from '@/store/core/errors/product-not-found-error';

const registerOrderBodySchema = z.object({
  customerId: z.uuid(),
  orderItems: z.array(
    z.object({
      productId: z.uuid(),
      quantity: z.number(),
      unitPrice: z.number(),
    }),
  ),
  deliveryAddress: z.string(),
});

type RegisterOrderBodySchema = z.infer<typeof registerOrderBodySchema>;

@Controller('/orders')
@ApiTags('Orders')
@Public()
export class RegisterOrderController {
  constructor(private registerOrder: RegisterOrderUseCase) {}

  @Post()
  @UsePipes(new ZodPipe(registerOrderBodySchema))
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new order' })
  @ApiBody({
    schema: {
      example: {
        customerId: 'a3a3a3a3-b2b2-4c4c-8d8d-9f9f9f9f9f9f',
        orderItems: [
          {
            productId: 'b4b4b4b4-c3c3-5d5d-9e9e-0a0a0a0a0a0a',
            quantity: 2,
            unitPrice: 1200,
          },
        ],
        deliveryAddress: 'Rua Silva, 123 - Curitiba/PR',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Order successfully created',
    schema: {
      example: {
        order: {
          id: 'd5d5d5d5-e6e6-7f7f-0b0b-1c1c1c1c1c1c',
          customerId: 'a3a3a3a3-b2b2-4c4c-8d8d-9f9f9f9f9f9f',
          totalAmount: 2400,
          deliveryAddress: 'Rua Silva, 123 - Curitiba/PR',
          status: 'PENDING',
          createdAt: '2024-09-10T12:00:00.000Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Customer, product or order not found',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or insufficient stock',
  })
  @ApiConflictResponse({
    description: 'Conflict creating order',
  })
  async handle(@Body() body: RegisterOrderBodySchema) {
    const { customerId, orderItems, deliveryAddress } = body;

    const result = await this.registerOrder.execute({
      customerId,
      orderItems,
      deliveryAddress,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message);
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case ProductNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const order = unwrapEither(result).order;
    return {
      order,
    };
  }
}
