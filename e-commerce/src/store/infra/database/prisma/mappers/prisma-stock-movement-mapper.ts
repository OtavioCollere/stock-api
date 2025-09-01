import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { StockMovement } from "@/store/domain/enterprise/entities/stockMovement";
import { StockMovement as PrismaStockMovement, Prisma } from "@prisma/client";

export class PrismaStockMovementMapper {
  static toDomain(raw: PrismaStockMovement): StockMovement {
    const stockMovement = StockMovement.create(
      {
        productId: new UniqueEntityID(raw.productId),
        sellerId: new UniqueEntityID(raw.sellerId),
        type: raw.type,
        quantity: raw.quantity,
        reason: raw.reason ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );

    return stockMovement;
  }

  static toPrisma(stockMovement: StockMovement): Prisma.StockMovementUncheckedCreateInput {
    return {
      id: stockMovement.id.toString(),
      productId: stockMovement.productId.toString(),
      sellerId: stockMovement.sellerId.toString(),
      type: stockMovement.type,
      quantity: stockMovement.quantity,
      reason: stockMovement.reason ?? null,
      createdAt: stockMovement.createdAt,
      updatedAt: stockMovement.updatedAt,
    };
  }
}
