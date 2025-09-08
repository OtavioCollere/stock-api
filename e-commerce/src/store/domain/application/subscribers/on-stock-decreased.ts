<<<<<<< HEAD
import { DomainEvents } from "@/store/core/events/domain.events";
import { EventHandler } from "@/store/core/events/event-handler";
import { StockDecreasedEvent } from "../../enterprise/events/stock-decreased-event";
import type { StockMovementRepository } from "../repositories/stock-movement-repository";
import { StockMovement } from "../../enterprise/entities/stockMovement";

export class OnStockDecreased implements EventHandler{

  constructor(
    private stockMovementRepository: StockMovementRepository
  ) {
=======
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
>>>>>>> ee25a86ff657c0d62cfc81f8c1db754474aa2d91
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
<<<<<<< HEAD
      this.stockDecreasedHandler.bind(this),
=======
      this.saveStockDecreasedMovement.bind(this),
>>>>>>> ee25a86ff657c0d62cfc81f8c1db754474aa2d91
      StockDecreasedEvent.name
    )
  }

<<<<<<< HEAD
  private async stockDecreasedHandler(event: StockDecreasedEvent) {
    console.log(
      'stock decreased ',
      event.productId.toString(),
      event.quantity,
      event.reason
    );

    const stockMovement = StockMovement.create({
      productId: event.productId,
      sellerId: event.sellerId, 
      quantity: event.quantity,
      type: 'OUT',
      reason: event.reason
    })

    await this.stockMovementRepository.create(stockMovement)
  }
  
=======
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
>>>>>>> ee25a86ff657c0d62cfc81f8c1db754474aa2d91

}