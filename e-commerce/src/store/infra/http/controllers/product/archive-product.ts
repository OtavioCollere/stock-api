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
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { ZodPipe } from '../../pipes/zod-validation-pipe';
import { isLeft, unwrapEither } from '@/store/core/either/either';
import { ArchiveProductUseCase } from '@/store/domain/application/use-cases/products/archive-product';
import { ProductNotFoundError } from '@/store/core/errors/product-not-found-error';
import { ProductMustBeActiveError } from '@/store/core/errors/product-must-be-active-error';
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error';
import { UserNotAuthorizedError } from '@/store/core/errors/user-not-authorized-error';

const archiveProductBodySchema = z.object({
  productId: z.string().uuid(),
  updateByUserId: z.string().uuid(),
});

type ArchiveProductBodySchema = z.infer<typeof archiveProductBodySchema>;

@Controller('/products')
@ApiTags('Products')
export class ArchiveProductController {
  constructor(private archiveProduct: ArchiveProductUseCase) {}

  @ApiOperation({ summary: 'Archive a product' })
  @Patch('/archive')
  @UsePipes(new ZodPipe(archiveProductBodySchema))
  @ApiBody({
    description: 'Data required to archive a product',
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
    description: 'Product archived successfully',
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'ID of the archived product',
        },
        status: {
          type: 'string',
          description: 'Current status of the product',
          example: 'archived',
        },
      },
      example: {
        productId: 'a3f1b0f8-8c3e-4a9f-98a2-2a8c4e9c1234',
        status: 'archived',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Product not found or not active',
    schema: {
      example: {
        statusCode: 409,
        message: 'Product not found or must be active before archiving',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error or unauthorized user',
    schema: {
      example: {
        statusCode: 400,
        message: 'User is not authorized to archive this product',
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(201)
  async handle(@Body() body: ArchiveProductBodySchema) {
    const { productId, updateByUserId } = body;

    const result = await this.archiveProduct.execute({
      productId,
      updateByUserId,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case ProductNotFoundError:
          throw new ConflictException(error.message);
        case ProductMustBeActiveError:
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
