import type { HashComparer } from "@/store/domain/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/store/domain/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import {compare, hash} from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashComparer, HashGenerator{
  async hash(plain: string, salt: number): Promise<string> {
    return await hash(plain, 8);
  }

  async compare(plain: string, hashedPassword: string): Promise<boolean> {
    return compare(plain, hashedPassword)
  }
}