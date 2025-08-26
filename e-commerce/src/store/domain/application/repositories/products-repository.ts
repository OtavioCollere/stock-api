import type { Product } from "../../enterprise/entities/product";

export abstract class ProductsRepository{
  abstract findById(id : string) : Promise<Product | null>  
  abstract findBySlug(slug : string) : Promise<Product | null>  
  abstract create(product : Product) : Promise<Product>
  abstract save(product: Product) : Promise<Product>
}