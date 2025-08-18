import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { User, type UserProps } from "@/store/domain/enterprise/entities/user";
import { faker } from "@faker-js/faker";

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