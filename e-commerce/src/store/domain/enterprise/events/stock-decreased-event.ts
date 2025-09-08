import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { DomainEvent } from "@/store/core/events/domain-event";
<<<<<<< HEAD

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
=======
import { Injectable } from "@nestjs/common";

@Injectable()
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

>>>>>>> ee25a86ff657c0d62cfc81f8c1db754474aa2d91
}