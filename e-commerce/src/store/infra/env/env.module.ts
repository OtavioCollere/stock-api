import { Module } from '@nestjs/common';
import { EnvService } from './env.service';

@Module({
  imports : [EnvService],
  exports : [EnvService]
})
export class EnvModule {}
