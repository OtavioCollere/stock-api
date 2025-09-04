import { EventHandler } from "@/store/core/events/event-handler";
import { StockMovementRepository } from "../../application/repositories/stock-movement-repository";
import { StockMovement } from "../../enterprise/entities/stockMovement";
import { StockIncreseadEvent } from "../../enterprise/events/stock-increased-event";
import { DomainEvents } from "@/store/core/events/domain-events";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnStockIncresead implements EventHandler{

  constructor(
    private stockMovementRepository : StockMovementRepository
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.saveStockIncreasedEvent.bind(this),
      StockIncreseadEvent.name
    )
  }

  async saveStockIncreasedEvent(event : StockIncreseadEvent){
    const stockMovement = StockMovement.create({
      sellerId : event.sellerId,
      productId : event.productId,
      quantity: event.quantity,
      type: 'IN',
      reason : event.reason,
    })

    await this.stockMovementRepository.create(stockMovement)
  }

  
}