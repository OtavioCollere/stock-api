import { ProductsRepository } from "@/store/domain/application/repositories/products-repository";
import { Product } from "@/store/domain/enterprise/entities/product";
import { PrismaService } from "../../prisma.service";
import { PrismaProductsMapper } from "../mappers/prisma-products-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaProductsRepository implements ProductsRepository{
  constructor(
    private prismaService : PrismaService
  ){}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where : {
        id
      }
    })

    if(!product) return null

    return PrismaProductsMapper.toDomain(product)
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prismaService.product.findFirst({
      where : {
        name : {
          contains : slug,
          mode : "insensitive"
        }
      }
    })

    if(!product) return null

    return PrismaProductsMapper.toDomain(product)
  }

  async create(product: Product): Promise<Product> {
    const data = PrismaProductsMapper.toPrisma(product)

    await this.prismaService.product.create({
      data
    })

    return product
  }

  async save(product: Product): Promise<Product> {
    
    await this.prismaService.product.update({
      where : {
        id: product.id.toString()
      },
      data : PrismaProductsMapper.toPrisma(product)
    })

    return product;

  }
  
}