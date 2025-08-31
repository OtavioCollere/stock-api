import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { User, type UserProps } from "@/store/domain/enterprise/entities/user";
import { PrismaService } from "@/store/infra/database/prisma.service";
import { PrismaUsersMapper } from "@/store/infra/database/prisma/mappers/prisma-users-mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeUser(override : Partial<UserProps> = {}, id? : UniqueEntityID) {
  const user = User.create({
    name : faker.person.fullName(),
    cpf : '12345678922',
    email : faker.internet.email(),
    password : '1234',
    phone: '41996335828',
    role : 'customer',
    birthDate : new Date(),
    ...override
  }, id)

  return user;
}
@Injectable()
export class UserFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prismaService.user.create({
      data: PrismaUsersMapper.toPrisma(user),
    });
    
    return user;
  }
  
  
}
