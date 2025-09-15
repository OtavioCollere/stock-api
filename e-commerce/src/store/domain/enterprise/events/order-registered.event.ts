import type { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import type { DomainEvent } from "@/store/core/events/domain-event";

export class OrderRegisteredEvent implements DomainEvent{
  public orderId: UniqueEntityID
  public amount : number
  public currency : string
  public ocurredAt: Date;

  constructor(orderId : UniqueEntityID, amount : number, currency : string) {
    this.orderId = orderId,
    this.amount = amount,
    this.currency = currency,
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.orderId
  }
}