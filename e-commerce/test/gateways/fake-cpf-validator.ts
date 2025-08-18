import type { CpfValidator } from "@/store/domain/application/gateways/cpf-validator";

export class FakeCpfValidator implements CpfValidator {
  constructor(private readonly shouldBeValid: boolean = true) {}

  async verifyCPF(cpf: string): Promise<boolean> {
    return this.shouldBeValid
  }
}