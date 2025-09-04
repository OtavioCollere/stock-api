import { DomainEvents } from "@/store/core/events/domain-events";
import { EventHandler } from "@/store/core/events/event-handler";
import { StockDecreasedEvent } from "../../enterprise/events/stock-decreased-event";
import { StockMovementRepository } from "../repositories/stock-movement-repository";
import { StockMovement } from "../../enterprise/entities/stockMovement";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnStockDecresead implements EventHandler{
  constructor(
    private stockMovementRepository : StockMovementRepository
  ){
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.saveStockDecreasedMovement.bind(this),
      StockDecreasedEvent.name
    )
  }

  private async saveStockDecreasedMovement( event : StockDecreasedEvent){
    const stockMovement = StockMovement.create({
      sellerId : event.sellerId,
      productId : event.productId,
      quantity: event.quantity,
      type: 'OUT',
      reason : event.reason,
    })

    console.log("decreased")

    await this.stockMovementRepository.create(stockMovement)
  }

}