import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { ProductNotFoundError } from '@/store/core/errors/product-not-found-error';
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error';
import { UserNotAuthorizedError } from '@/store/core/errors/user-not-authorized-error';
import { DecreaseQuantityUseCase } from '@/store/domain/application/use-cases/products/decrease-quantity';
import { InsufficientStockError } from '@/store/core/errors/insufficient-stock-error';

const decreaseQuantityBodySchema = z.object({
  productId: z.string().uuid(),
  sellerId: z.string().uuid(),
  reason: z.string().optional(),
  quantity: z.coerce.number(),
});

type DecreaseQuantityBodySchema = z.infer<typeof decreaseQuantityBodySchema>;

@Controller('/products')
@ApiTags('Products')
@ApiBearerAuth('access-token')
export class DecreaseQuantityController {
  constructor(private decreaseQuantity: DecreaseQuantityUseCase) {}

  @ApiOperation({ summary: 'Decrease product quantity (stock movement)' })
  @Patch('/decrease-quantity')
  @UsePipes(new ZodPipe(decreaseQuantityBodySchema))
  @ApiBody({
    description: 'Data required to decrease product quantity',
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          format: 'uuid',
          example: 'c3d2e1f0-1234-5678-9abc-def123456789',
        },
        sellerId: {
          type: 'string',
          format: 'uuid',
          example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        },
        reason: {
          type: 'string',
          example: 'Damaged during transport',
        },
        quantity: {
          type: 'number',
          example: 5,
        },
      },
      required: ['productId', 'sellerId', 'quantity'],
    },
  })
  @ApiCreatedResponse({
    description: 'Stock decreased successfully',
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'ID of the product',
        },
        sellerId: {
          type: 'string',
          description: 'ID of the seller responsible for the operation',
        },
        type: {
          type: 'string',
          description: 'Type of stock movement (e.g., DECREASE)',
        },
        reason: {
          type: 'string',
          description: 'Reason for decreasing the stock',
        },
        quantity: {
          type: 'number',
          description: '10',
        },
      },
      example: {
        productId: 'c3d2e1f0-1234-5678-9abc-def123456789',
        sellerId: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        type: 'DECREASE',
        reason: 'Damaged during transport',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 409,
        message: 'Product not found',
        error: 'Conflict',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Seller not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error or unauthorized user',
    schema: {
      example: {
        statusCode: 400,
        message: 'User is not authorized to decrease quantity of this product',
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(201)
  async handle(@Body() body: DecreaseQuantityBodySchema) {
    const { productId, sellerId, reason, quantity } = body;

    const result = await this.decreaseQuantity.execute({
      productId,
      sellerId,
      reason,
      quantity,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case ProductNotFoundError:
          throw new ConflictException(error.message);
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case UserNotAuthorizedError:
          throw new BadRequestException(error.message);
        case InsufficientStockError:
          throw new UnprocessableEntityException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const stockMovement = unwrapEither(result);

    return {
      productId: stockMovement.productId.toString(),
      sellerId: stockMovement.sellerId.toString(),
      type: stockMovement.type,
      reason: stockMovement.reason,
      quantity : stockMovement.quantity
    };
  }
}
