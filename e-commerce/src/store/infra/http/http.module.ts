import { Module } from "@nestjs/common";
import { RegisterUserController } from "./controllers/users/register-user";
import { RegisterUserUseCase } from "@/store/domain/application/use-cases/users/register-user";
import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GatewaysModule } from "../gateways/gateways.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/users/authenticate-user";
import { AuthenticateUseCase } from "@/store/domain/application/use-cases/users/authenticate";
import { RegisterProductUseCase } from "@/store/domain/application/use-cases/products/register-product";
import { RegisterProductController } from "./controllers/product/register-product";
import { ActiveProductUseCase } from "@/store/domain/application/use-cases/products/active-product";
import { ActiveProductController } from "./controllers/product/active-product";
import { ArchiveProductController } from "./controllers/product/archive-product";
import { ArchiveProductUseCase } from "@/store/domain/application/use-cases/products/archive-product";
import { DecreaseQuantityUseCase } from "@/store/domain/application/use-cases/products/decrease-quantity";
import { DecreaseQuantityController } from "./controllers/product/decrease-quantity";
import { IncreaseQuantityController } from "./controllers/product/increase-quantity";
import { IncreaseQuantityUseCase } from "@/store/domain/application/use-cases/products/increase-quantity";


@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule, GatewaysModule],
  providers: [
    RegisterUserUseCase,
    AuthenticateUseCase,

    RegisterProductUseCase,
    ActiveProductUseCase,
    ArchiveProductUseCase,

    DecreaseQuantityUseCase,
    IncreaseQuantityUseCase
  ],
  controllers : [
    RegisterUserController,
    AuthenticateController,

    RegisterProductController,
    ActiveProductController,
    ArchiveProductController,

    DecreaseQuantityController,
    IncreaseQuantityController
  ]
})
export class HttpModule {}
