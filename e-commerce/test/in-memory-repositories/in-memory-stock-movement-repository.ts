import { StockMovementRepository } from "@/store/domain/application/repositories/stock-movement-repository";
import { StockMovement } from "@/store/domain/enterprise/entities/stockMovement";


export class InMemoryStockMovementRepository implements StockMovementRepository {
  public items: StockMovement[] = [];

  async findById(id: string): Promise<StockMovement | null> {
    const stockMovement = this.items.find((item) => item.id.toString() === id);

    if (!stockMovement) return null;

    return stockMovement;
  }

  async create(stockMovement: StockMovement): Promise<StockMovement> {
    this.items.push(stockMovement);
    return stockMovement;
  }

  async save(stockMovement: StockMovement): Promise<StockMovement> {
    const index = this.items.findIndex((item) => item.id.toString() === stockMovement.id.toString());

    if (index >= 0) {
      this.items[index] = stockMovement;
    } else {
      this.items.push(stockMovement);
    }

    return stockMovement;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id);
  }

  async findAll(): Promise<StockMovement[]> {
    return this.items;
  }
}
