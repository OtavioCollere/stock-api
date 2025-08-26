import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { Category, type CategoryProps } from "@/store/domain/enterprise/entities/category";
import { faker } from "@faker-js/faker";

export function makeCategory(override : Partial<CategoryProps> = {}, id? : UniqueEntityID) {
  const category = Category.create({
    name : faker.person.fullName(),
    createdBy : new UniqueEntityID(),
    ...override
  }, id)

  return category;
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
