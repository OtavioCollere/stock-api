import { Injectable } from "@nestjs/common";
import type { UsersRepository } from "../../repositories/users-repository";
import type { ProductsRepository } from "../../repositories/products-repository";
import type { StockMovementRepository } from "../../repositories/stock-movement-repository";
import type { Either } from "@/store/core/either/either";

export interface DecreaseStockUseCaseRequest{

}

type DecreaseStockUseCaseResponse = Either<

>


@Injectable()
export class DecreaseStockUseCase{

  constructor(
    private usersRepository: UsersRepository,
    private productsRepository: ProductsRepository,
    private stockMovementRepository: StockMovementRepository,
  ) {}

  async execute(){}

}