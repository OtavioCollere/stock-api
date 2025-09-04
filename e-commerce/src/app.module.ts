import { Module } from '@nestjs/common';
import { EnvModule } from './store/infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './store/infra/env/env';
import { HttpModule } from './store/infra/http/http.module';
import { EventsModule } from './store/infra/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate : (env) => envSchema.parse(env),
      isGlobal : true
    }),
    EnvModule,
    HttpModule,
    EventsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
