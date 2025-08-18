import type { HashGenerator } from "@/store/domain/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator{
  async hash(plain: string, salt: number): Promise<string> {
    return plain.concat('-hashed')
  }
  
}