import { HashGenerator } from "@/store/domain/application/cryptography/hash-generator";
import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { HashComparer } from "@/store/domain/application/cryptography/hash-comparer";
import { Encrypter } from "@/store/domain/application/cryptography/encrypter";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers : [
    {provide : Encrypter, useClass : JwtEncrypter},
    {provide : HashGenerator, useClass : BcryptHasher},
    {provide : HashComparer, useClass : BcryptHasher},
  ],
  exports : [Encrypter, HashGenerator, HashComparer]
})
export class CryptographyModule{}