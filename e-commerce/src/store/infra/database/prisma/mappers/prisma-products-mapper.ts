import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Product } from "@/store/domain/enterprise/entities/product";
import { Product as PrismaProduct, type Prisma } from "@prisma/client";

export class PrismaProductsMapper {
  static toDomain(raw: PrismaProduct): Product {
    const product = Product.create(
      {
        categoryId: new UniqueEntityID(raw.categoryId),
        createdByUserId: new UniqueEntityID(raw.createdByUserId),
        updatedByUserId: raw.updatedByUserId
          ? new UniqueEntityID(raw.updatedByUserId)
          : undefined,
        name: raw.name,
        slug: raw.slug,
        productCode: raw.productCode ?? '',
        description: raw.description ?? '',
        quantity: raw.quantity,
        currentPrice: raw.currentPrice,
        status: raw.status,
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );

    return product;
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      categoryId: product.categoryId.toString(),
      createdByUserId: product.createdByUserId.toString(),
      updatedByUserId: product.updatedByUserId
        ? product.updatedByUserId.toString()
        : null, // <-- corrigido
      name: product.name,
      slug: product.slug,
      productCode: product.productCode ?? '',
      description: product.description ?? '',
      quantity: product.quantity,
      currentPrice: product.currentPrice,
      status: product.status,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
    };
  }
}
