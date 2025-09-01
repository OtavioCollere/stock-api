import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { StockMovement, type StockMovementProps } from "@/store/domain/enterprise/entities/stockMovement";
import { PrismaService } from "@/store/infra/database/prisma.service";
import { PrismaStockMovementMapper } from "@/store/infra/database/prisma/mappers/prisma-stock-movement-mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeStockMovement(
  override: Partial<StockMovementProps> = {},
  id?: UniqueEntityID,
) {
  const stockMovement = StockMovement.create(
    {
      productId: new UniqueEntityID(),
      sellerId: new UniqueEntityID(),
      type: faker.helpers.arrayElement(["IN", "OUT"]),
      reason: faker.lorem.sentence(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return stockMovement;
}

@Injectable()
export class StockMovementFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaStockMovement(
    data: Partial<StockMovementProps> = {},
  ): Promise<StockMovement> {
    const stockMovement = makeStockMovement(data);

    await this.prismaService.stockMovement.create({
      data: PrismaStockMovementMapper.toPrisma(stockMovement),
    });

    return stockMovement;
  }
}
