import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "@/store/domain/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { ProductsRepository } from "@/store/domain/application/repositories/products-repository";
import { PrismaProductsRepository } from "./prisma/repositories/prisma-products-repository";
import { CategoriesRepository } from "@/store/domain/application/repositories/categories-repository";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";

@Module({
  providers : [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : ProductsRepository, useClass : PrismaProductsRepository},
    {provide : CategoriesRepository, useClass : PrismaCategoriesRepository},
  ],
  exports : [PrismaService,
    UsersRepository,
    ProductsRepository,
    CategoriesRepository
  ],
})
export class DatabaseModule{}