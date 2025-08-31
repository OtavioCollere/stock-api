import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Category, type CategoryProps } from "@/store/domain/enterprise/entities/category";
import { PrismaService } from "@/store/infra/database/prisma.service";
import { PrismaCategoriesMapper } from "@/store/infra/database/prisma/mappers/prisma-categories-mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";


export function makeCategory(override : Partial<CategoryProps> = {}, id? : UniqueEntityID) {
  const category = Category.create({
    name : faker.person.fullName(),
    createdBy : new UniqueEntityID(),
    ...override
  }, id)

  return category;
}

@Injectable()
export class CategoryFactory {
  constructor(private prismaService: PrismaService) {}

  async makeCategory(data: Partial<CategoryProps
    > = {}): Promise<Category> {
    const category = makeCategory(data);

    await this.prismaService.category.create({
      data: PrismaCategoriesMapper.toPrisma(category),
    });
    
    return category;
  }
}
