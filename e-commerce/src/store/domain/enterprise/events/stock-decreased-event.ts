import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { DomainEvent } from "@/store/core/events/domain-event";

export class StockDecreasedEvent implements DomainEvent{
  public ocurredAt : Date;
  public quantity: number;
  public reason? : string
  public sellerId: UniqueEntityID;
  public productId: UniqueEntityID;

  constructor(productId : UniqueEntityID, quantity: number, sellerId : UniqueEntityID, reason? : string) {
    this.productId = productId
    this.quantity = quantity
    this.sellerId = sellerId
    this.reason = reason
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.productId
  }

}