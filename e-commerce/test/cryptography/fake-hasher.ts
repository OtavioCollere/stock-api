import type { HashComparer } from "@/store/domain/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/store/domain/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer{
  async compare(plain: string, hashedPassword: string): Promise<boolean> {
    return plain.concat('-hashed') === hashedPassword
  }

  async hash(plain: string, salt: number): Promise<string> {
    return plain.concat('-hashed')
  }
  
}