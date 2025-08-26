import { Entity } from "@/store/core/entities/entity"
import type { UniqueEntityID } from "@/store/core/entities/unique-entity-id"
import type { Optional } from "@/store/core/types/optional"


export interface CategoryProps {
  name: string
  createdBy : UniqueEntityID
  updatedBy?: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Category extends Entity<CategoryProps> {

  static create(props : Optional<CategoryProps, 'createdAt' | 'updatedAt' | 'updatedBy'>, id? : UniqueEntityID) {
    
    const category = new Category({
      ...props,
      createdAt : new Date(),
    }, 
    id)

    return category;
  }

  // ---------- GETTERS ----------

  // ---------- TOUCH ----------
  private touch() {
    this.props.updatedAt = new Date()
  }
}
