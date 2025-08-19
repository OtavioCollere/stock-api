import { UsersRepository } from "@/store/domain/application/repositories/users-repository";
import { User } from "@/store/domain/enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PrismaUsersMapper } from "../mappers/prisma-users-mapper";

@Injectable()
export class PrismaUsersRepository implements UsersRepository{

  constructor(private prismaService : PrismaService) {}
  
  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where : {
        id
      }
    })

    if(!user) return null

    return PrismaUsersMapper.toDomain(user)
  }

  
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where : {
        email
      }
    })


    if(!user) return null

    return PrismaUsersMapper.toDomain(user)
  }
  
  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where : {
        cpf
      }
    })

    if(!user) return null

    return PrismaUsersMapper.toDomain(user)
  }
  
  async create(user: User): Promise<User> {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prismaService.user.create({
      data 
    })

    return user;
  }
  
  async save(user: User): Promise<User> {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prismaService.user.update({
      where : {
        id: data.id?.toString()
      },
      data 
    })

    return user
  }
  
}