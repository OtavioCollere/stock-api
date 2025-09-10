import { DomainEvents } from "@/store/core/events/domain.events";
import { EventHandler } from "@/store/core/events/event-handler";
import { StockDecreasedEvent } from "../../enterprise/events/stock-decreased-event";
import { StockMovementRepository } from "../repositories/stock-movement-repository";
import { StockMovement } from "../../enterprise/entities/stockMovement";


export class OnStockDecreased implements EventHandler{

  constructor(
    private stockMovementRepository: StockMovementRepository
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.stockDecreasedHandler.bind(this),
      StockDecreasedEvent.name
    )
  }

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
  

}