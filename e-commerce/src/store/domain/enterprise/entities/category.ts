import { Entity } from "@/store/core/entities/entity"
import { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import { Optional } from "@/store/core/types/optional"

export interface CategoryProps {
  name: string
  createdBy: UniqueEntityID
  updatedBy?: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Category extends Entity<CategoryProps> {
  static create(
    props: Optional<CategoryProps, "createdAt" | "updatedAt" | "updatedBy">,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? undefined,
        updatedBy: props.updatedBy ?? undefined,
      },
      id,
    )

    return category
  }

  // ---------- GETTERS ----------
  get name() {
    return this.props.name
  }

  get createdBy() {
    return this.props.createdBy
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // ---------- SETTERS ----------
  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  set updatedBy(userId: UniqueEntityID | undefined) {
    this.props.updatedBy = userId
    this.touch()
  }

  // ---------- TOUCH ----------
  private touch() {
    this.props.updatedAt = new Date()
  }
}
