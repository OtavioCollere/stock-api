import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { DomainEvent } from "@/store/core/events/domain-event";

export class StockDecreasedEvent implements DomainEvent{
  public ocurredAt: Date;
  public productId : UniqueEntityID
  public sellerId : UniqueEntityID
  public quantity : number;
  public reason : string

  constructor(
    productId : UniqueEntityID,
    sellerId : UniqueEntityID,
    quantity : number,
    reason? : string
  ) {
    this.ocurredAt = new Date();
    this.productId = productId;
    this.sellerId = sellerId;
    this.quantity = quantity;
    this.reason = reason ?? ''
  }

  getAggregateId(): UniqueEntityID {
    return this.productId;
  }
}