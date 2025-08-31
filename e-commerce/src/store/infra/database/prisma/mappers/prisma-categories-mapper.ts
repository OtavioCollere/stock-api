import { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import { Category } from "@/store/domain/enterprise/entities/category"
import { Category as PrismaCategory, Prisma } from "@prisma/client"

export class PrismaCategoriesMapper {
  static toDomain(raw: PrismaCategory): Category {
    const category = Category.create(
      {
        name: raw.name,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return category
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      createdBy: category.createdBy.toString(),
      updatedBy: category.updatedBy?.toString(),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}
