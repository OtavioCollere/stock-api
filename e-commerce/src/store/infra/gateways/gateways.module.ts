import { CpfValidator } from "@/store/domain/application/gateways/cpf-validator";
import { Module } from "@nestjs/common";
import { HttpCpfValidator } from "./http-cpf-validator";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [EnvModule],
  providers: [
    { provide: CpfValidator, useClass: HttpCpfValidator }
  ],
  exports: [CpfValidator]
})
export class GatewaysModule {}
