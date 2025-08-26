import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Product, type ProductProps } from "@/store/domain/enterprise/entities/product";
import { faker } from "@faker-js/faker";

export function makeProduct(override : Partial<ProductProps> = {}, id? : UniqueEntityID) {
  const product = Product.create({
    name : faker.person.fullName(),
    categoryId : new UniqueEntityID(),
    productCode : 'AS36',
    currentPrice : 1200,
    createdByUserId : new UniqueEntityID(),
    description : 'SOME DESC',
    quantity : 2,
    ...override
  }, id)

  return product;
}

// @Injectable()
// export class ProductFactory {
//   constructor(private prismaService: PrismaService) {}

//   async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
//     const product = makeProduct(data);

//     await this.prismaService.user.create({
//       data: .toPrisma(product),
//     });
    
//     return product;
//   }
// }
