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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { ZodPipe } from '../../pipes/zod-validation-pipe';
import { isLeft, unwrapEither } from '@/store/core/either/either';
import { ActiveProductUseCase } from '@/store/domain/application/use-cases/products/active-product';
import { ProductNotFoundError } from '@/store/core/errors/product-not-found-error';
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error';
import { UserNotAuthorizedError } from '@/store/core/errors/user-not-authorized-error';

const activeProductBodySchema = z.object({
  productId: z.string().uuid(),
  updateByUserId: z.string().uuid(),
});

type ActiveProductBodySchema = z.infer<typeof activeProductBodySchema>;

@Controller('/products')
@ApiTags('Products')
@ApiBearerAuth('access-token') 
export class ActiveProductController {
  constructor(private activeProduct: ActiveProductUseCase) {}

  @ApiOperation({ summary: 'Activate a product' })
  @Patch('/active')
  @UsePipes(new ZodPipe(activeProductBodySchema))
  @ApiBody({
    description: 'Data required to activate a product',
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          format: 'uuid',
          example: 'a3f1b0f8-8c3e-4a9f-98a2-2a8c4e9c1234',
        },
        updateByUserId: {
          type: 'string',
          format: 'uuid',
          example: 'b1e2c3d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
        },
      },
      required: ['productId', 'updateByUserId'],
    },
  })
  @ApiCreatedResponse({
    description: 'Product activated successfully',
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'ID of the activated product',
        },
        status: {
          type: 'string',
          description: 'Current status of the product',
          example: 'active',
        },
      },
      example: {
        productId: 'a3f1b0f8-8c3e-4a9f-98a2-2a8c4e9c1234',
        status: 'active',
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
  @ApiBadRequestResponse({
    description: 'Validation error or unauthorized user',
    schema: {
      example: {
        statusCode: 400,
        message: 'User is not authorized to activate this product',
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(201)
  async handle(@Body() body: ActiveProductBodySchema) {
    const { productId, updateByUserId } = body;

    const result = await this.activeProduct.execute({
      productId,
      updateByUserId,
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

    const product = unwrapEither(result).product;

    return {
      productId: product.id.toString(),
      status: product.status,
    };
  }
}
