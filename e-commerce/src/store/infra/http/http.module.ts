import { Module } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { RegisterUserController } from "./controllers/users/register-user";
import { RegisterUserUseCase } from "@/store/domain/application/use-cases/users/register-user";
import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GatewaysModule } from "../gateways/gateways.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/users/authenticate-user";
import { AuthenticateUseCase } from "@/store/domain/application/use-cases/users/authenticate";

@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule, GatewaysModule],
  exports: [PrismaService],
  providers: [
    PrismaService,

    RegisterUserUseCase,
    AuthenticateUseCase
  ],
  controllers : [
    RegisterUserController,
    AuthenticateController
  ]
})
export class HttpModule {}
