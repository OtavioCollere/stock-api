import { DomainEvent } from "@/store/core/events/domain-event";
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";

export class StockIncreseadEvent implements DomainEvent{
  public ocurredAt: Date;
  public productId : UniqueEntityID
  public sellerId : UniqueEntityID
  public reason? : string
  public quantity: number

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