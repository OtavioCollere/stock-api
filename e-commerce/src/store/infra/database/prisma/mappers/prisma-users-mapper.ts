import { UniqueEntityID } from "@/store/core/entities/unique-entity-id";
import { User } from "@/store/domain/enterprise/entities/user";
import { User as PrismaUser, Prisma } from "@prisma/client"; 

export class PrismaUsersMapper{
    static toDomain(raw : PrismaUser) : User{
      const user = User.create({
        name : raw.name,
        cpf : raw.cpf,
        email : raw.email,
        password : raw.password,
        role : raw.role,
        phone : raw.phone,
        birthDate : raw.birthDate,
        emailVerified : raw.emailVerified
      }, new UniqueEntityID(raw.id))

      return user
    }


    static toPrisma(user : User) : Prisma.UserUncheckedCreateInput{
      return {
        id : user.id.toString(),
        name: user.name,
        cpf : user.cpf,
        email : user.email,
        password : user.password,
        role : user.role,
        phone : user.phone,
        birthDate:
        user.birthDate instanceof Date
          ? user.birthDate
          : new Date(user.birthDate), 
        emailVerified : user.emailVerified
      }
    }
}