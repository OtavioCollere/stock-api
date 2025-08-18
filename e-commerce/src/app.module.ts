import { Module } from '@nestjs/common';
import { EnvModule } from './store/infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './store/infra/env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate : (env) => envSchema.parse(env),
      isGlobal : true
    }),
    EnvModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
