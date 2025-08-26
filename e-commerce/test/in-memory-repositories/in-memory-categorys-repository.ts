import type { CategorysRepository } from "@/store/domain/application/repositories/categorys-repository";
import type { Category } from "@/store/domain/enterprise/entities/category";

export class InMemoryCategorysRepository implements CategorysRepository{
  public items: Category[] = []

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id);

    if (!category) return null;

    return category;
  }

}