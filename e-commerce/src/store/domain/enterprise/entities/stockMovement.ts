import { Entity } from "@/store/core/entities/entity"
import type { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import type { Optional } from "@/store/core/types/optional"

export interface StockMovementProps {
  productId : UniqueEntityID
  sellerId : UniqueEntityID
  type : 'IN' | 'OUT'
  reason? : string
  quantity : number
  createdAt?: Date
  updatedAt?: Date
}

export class StockMovement extends Entity<StockMovementProps> {
  static create(
    props: Optional<StockMovementProps, 'createdAt' | 'updatedAt' | 'reason'>,
    id?: UniqueEntityID,
  ) {
    const stockMovement = new StockMovement(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    );

    return stockMovement;
  }

  // ---------- GETTERS ----------
  get productId(): UniqueEntityID {
    return this.props.productId;
  }

  get quantity() {
    return this.props.quantity
  }

  get sellerId(): UniqueEntityID {
    return this.props.sellerId;
  }

  get type(): 'IN' | 'OUT' {
    return this.props.type;
  }

  get reason(): string | undefined {
    return this.props.reason;
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  // ---------- SETTERS ----------
  set type(newType: 'IN' | 'OUT') {
    this.props.type = newType;
    this.touch();
  }

  set reason(newReason: string | undefined) {
    this.props.reason = newReason;
    this.touch();
  }

  // ---------- TOUCH ----------
  private touch() {
    this.props.updatedAt = new Date();
  }
}
