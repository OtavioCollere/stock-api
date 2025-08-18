import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";

@Injectable()
export abstract class UsersRepository{
  abstract findById(id : string) : Promise<User | null>
  abstract findByEmail(email : string) : Promise<User | null>
  abstract findByCpf(cpf : string) : Promise<User | null>
  abstract create(user : User) : Promise<User>
  abstract save(user: User) : Promise<User>
}