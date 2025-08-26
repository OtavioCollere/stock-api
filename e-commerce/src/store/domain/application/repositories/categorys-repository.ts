import type { Category } from "../../enterprise/entities/category";

export abstract class CategorysRepository{
  abstract findById(id : string) : Promise<Category | null>
}