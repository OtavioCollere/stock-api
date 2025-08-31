
import { Category } from "@/store/domain/enterprise/entities/category";
import { PrismaService } from "../../prisma.service";
import { CategoriesRepository } from "@/store/domain/application/repositories/categories-repository";
import { PrismaCategoriesMapper } from "../mappers/prisma-categories-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository{
  constructor(
    private prismaService : PrismaService
  ){}

  async findById(id: string): Promise<Category | null> {
  const category = await this.prismaService.category.findUnique({
      where : {
        id
      }
    })

    if(!category) return null

    return PrismaCategoriesMapper.toDomain(category)
  }

 
}