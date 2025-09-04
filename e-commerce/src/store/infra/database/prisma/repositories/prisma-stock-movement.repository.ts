import { StockMovementRepository } from "@/store/domain/application/repositories/stock-movement-repository";
import { StockMovement } from "@/store/domain/enterprise/entities/stockMovement";
import { PrismaService } from "../../prisma.service";
import { PrismaStockMovementMapper } from "../mappers/prisma-stock-movement-mapper";

export class PrismaStockMovementRepository implements StockMovementRepository{
  constructor(
    private prismaService : PrismaService
  ){}

  async create(stockMovement: StockMovement): Promise<StockMovement> {
    const data = PrismaStockMovementMapper.toPrisma(stockMovement)  
    
    this.prismaService.stockMovement.create({
        data
      })

      return stockMovement;
  }

}