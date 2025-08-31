import type { CategoriesRepository } from "@/store/domain/application/repositories/categories-repository";
import type { Category } from "@/store/domain/enterprise/entities/category";

export class InMemoryCategoriesRepository implements CategoriesRepository{
  public items: Category[] = []

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id);

    if (!category) return null;

    return category;
  }

}