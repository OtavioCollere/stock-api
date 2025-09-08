import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../../application/repositories/products-repository";

@Injectable()
export class StockService{
  constructor(
    private productsRepository : ProductsRepository
  ) {}

  async canBuy(productId: string, quantity: number){
    const product = await this.productsRepository.findById(productId)

    if(!product) return false

    return product.quantity >= quantity
  }
}