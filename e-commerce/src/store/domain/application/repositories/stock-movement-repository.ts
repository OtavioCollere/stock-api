import { Injectable } from "@nestjs/common";
import { StockMovement } from "../../enterprise/entities/stockMovement";

@Injectable()
export abstract class StockMovementRepository {
  abstract create(stockMovement: StockMovement): Promise<StockMovement>;
  // abstract findById(id: string): Promise<StockMovement | null>;
  // abstract save(stockMovement: StockMovement): Promise<StockMovement>;
  // abstract delete(id: string): Promise<void>;
  // abstract findAll(): Promise<StockMovement[]>;
}