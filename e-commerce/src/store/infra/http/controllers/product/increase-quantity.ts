import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
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
import { IncreaseQuantityUseCase } from '@/store/domain/application/use-cases/products/increase-quantity';

const increaseQuantityBodySchema = z.object({
  productId: z.uuid(),
  sellerId: z.uuid(),
  reason: z.string().optional(),
  quantity: z.coerce.number(),
});

type IncreaseQuantityBodySchema = z.infer<typeof increaseQuantityBodySchema>;

@Controller('/products')
@ApiTags('Products')
@ApiBearerAuth('access-token')
export class IncreaseQuantityController {
  constructor(private increaseQuantity: IncreaseQuantityUseCase) {}

  @ApiOperation({ summary: 'Increase product quantity (stock movement)' })
  @Patch('/increase-quantity')
  @UsePipes(new ZodPipe(increaseQuantityBodySchema))
  @ApiBody({
    description: 'Data required to increase product quantity',
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
          example: 'Restock from supplier',
        },
        quantity: {
          type: 'number',
          example: 20,
        },
      },
      required: ['productId', 'sellerId', 'quantity'],
    },
  })
  @ApiCreatedResponse({
    description: 'Stock increased successfully',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'ID of the product' },
        sellerId: { type: 'string', description: 'ID of the seller' },
        type: {
          type: 'string',
          description: 'Type of stock movement (always IN)',
          example: 'IN',
        },
        reason: {
          type: 'string',
          description: 'Reason for increasing the stock',
        },
      },
      example: {
        productId: 'c3d2e1f0-1234-5678-9abc-def123456789',
        sellerId: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        type: 'IN',
        reason: 'Restock from supplier',
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
    description: 'Unauthorized user or validation error',
    schema: {
      example: {
        statusCode: 400,
        message: 'User is not authorized to increase quantity of this product',
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(201)
  async handle(@Body() body: IncreaseQuantityBodySchema) {
    const { productId, sellerId, reason, quantity } = body;

    const result = await this.increaseQuantity.execute({
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
    };
  }
}
