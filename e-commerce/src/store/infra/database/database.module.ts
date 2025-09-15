import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UsersRepository } from "@/store/domain/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { ProductsRepository } from "@/store/domain/application/repositories/products-repository";
import { PrismaProductsRepository } from "./prisma/repositories/prisma-products-repository";
import { CategoriesRepository } from "@/store/domain/application/repositories/categories-repository";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { StockMovementRepository } from "@/store/domain/application/repositories/stock-movement-repository";
import { PrismaStockMovementRepository } from "./prisma/repositories/prisma-stock-movement.repository";
import { OrdersRepository } from "@/store/domain/application/repositories/orders-repository";
import { PrismaOrdersRepository } from "./prisma/repositories/prisma-orders-repository";
import { OrderItemsRepository } from "@/store/domain/application/repositories/order-item-repository";
import { PrismaOrderItemsRepository } from "./prisma/repositories/prisma-order-items-repository";

@Module({
  providers : [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : ProductsRepository, useClass : PrismaProductsRepository},
    {provide : CategoriesRepository, useClass : PrismaCategoriesRepository},
    {provide : StockMovementRepository, useClass : PrismaStockMovementRepository},
    {provide : OrdersRepository, useClass : PrismaOrdersRepository},
    {provide : OrderItemsRepository, useClass : PrismaOrderItemsRepository},
  ],
  exports : [PrismaService,
    UsersRepository,
    ProductsRepository,
    CategoriesRepository,
    StockMovementRepository,
    OrdersRepository
  ],
})
export class DatabaseModule{}