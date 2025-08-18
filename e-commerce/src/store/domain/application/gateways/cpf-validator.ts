import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CpfValidator {
  abstract verifyCPF(cpf : string) : Promise<boolean>
}