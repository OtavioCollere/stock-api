import {
  BadRequestException,
  Body,
  ConflictException,
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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { ZodPipe } from '../../pipes/zod-validation-pipe';
import { isLeft, unwrapEither } from '@/store/core/either/either';
import { RegisterProductUseCase } from '@/store/domain/application/use-cases/products/register-product';
import { ProductAlreadyExistsError } from '@/store/core/errors/product-already-exists-error';
import { CategoryNotFoundError } from '@/store/core/errors/category-not-found-error';
import { UserNotFoundError } from '@/store/core/errors/user-not-found-error';

const registerProductBodySchema = z.object({
  name: z.string().min(1),
  productCode: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(0),
  currentPrice: z.number().min(0),
  categoryId: z.uuid(),
  createdByUserId: z.uuid()
});

type RegisterProductBodySchema = z.infer<typeof registerProductBodySchema>;

@Controller('/products')
@ApiTags('Products')
export class RegisterProductController {
  constructor(private registerProduct: RegisterProductUseCase) {}

  @ApiOperation({ summary: 'Register a new product' })
  @Post()
  @UsePipes(new ZodPipe(registerProductBodySchema))
  @ApiBody({
    description: 'Product registration data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, example: 'Notebook Gamer' },
        productCode: { type: 'string', example: 'NB-12345' },
        description: { type: 'string', example: 'Notebook gamer com RTX 4060' },
        quantity: { type: 'number', example: 10 },
        currentPrice: { type: 'number', example: 7500.0 },
        categoryId: { type: 'string', format: 'uuid', example: 'a3f1b0f8-8c3e-4a9f-98a2-2a8c4e9c1234' },
        createdByUserId: { type: 'string', format: 'uuid', example: 'b1e2c3d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e' },
      },
      required: ['name', 'productCode', 'quantity', 'currentPrice', 'categoryId', 'createdByUserId'],
    },
  })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'ID of the created product' },
      },
      example: { productId: 'a3f1b0f8-8c3e-4a9f-98a2-2a8c4e9c1234' },
    },
  })
  @ApiConflictResponse({
    description: 'Product with the same name or code already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Product already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error (Zod)',
    schema: {
      example: {
        statusCode: 400,
        message: ['Name is required', 'Quantity must be >= 0'],
        error: 'Bad Request',
      },
    },
  })
  @HttpCode(201)
  async handle(@Body() body: RegisterProductBodySchema) {
    const { name, productCode, description, quantity, currentPrice, categoryId, createdByUserId } = body;

    const result = await this.registerProduct.execute({
      name,
      productCode,
      description,
      quantity,
      currentPrice,
      categoryId,
      createdByUserId
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case ProductAlreadyExistsError:
          throw new ConflictException(error.message);
        case CategoryNotFoundError:
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const product = unwrapEither(result).product;

    return {
      productId: product.id.toString()
    };
  }
}
