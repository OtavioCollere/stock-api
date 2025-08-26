import type { ProductsRepository } from "@/store/domain/application/repositories/products-repository";
import type { Product } from "@/store/domain/enterprise/entities/product";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) return null;

    return product;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = this.items.find((item) => item.slug === slug);

    if (!product) return null;

    return product;
  }

  async create(product: Product): Promise<Product> {
    this.items.push(product);
    return product;
  }

  async save(product: Product): Promise<Product> {
    const index = this.items.findIndex((item) => item.id.toString() === product.id.toString());

    if (index >= 0) {
      this.items[index] = product;
    } else {
      this.items.push(product);
    }

    return product;
  }
}
