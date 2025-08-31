import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Product, type ProductProps } from "@/store/domain/enterprise/entities/product";
import { PrismaService } from "@/store/infra/database/prisma.service";
import { PrismaProductsMapper } from "@/store/infra/database/prisma/mappers/prisma-products-mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeProduct(override : Partial<ProductProps> = {}, id? : UniqueEntityID) {
  const product = Product.create({
    name : faker.person.fullName(),
    categoryId : new UniqueEntityID(),
    productCode : 'AS36',
    currentPrice : 1200,
    createdByUserId : new UniqueEntityID(),
    description : 'SOME DESC',
    quantity : 2,
    ...override
  }, id)

  return product;
}

@Injectable()
export class ProductFactory {
  constructor(private prismaService: PrismaService) {}

  async makeProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data);

    await this.prismaService.product.create({
      data: PrismaProductsMapper.toPrisma(product),
    });
    
    return product;
  }
}
