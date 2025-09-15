import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './store/infra/env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
  .setTitle('E-commerce API')
  .setVersion('1.0')
  .addTag('ecommerce')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Insira o token JWT no formato: Bearer <token>',
      in: 'header',
    },
    'access-token', // nome que será usado no @ApiBearerAuth
  )
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);

  app.connectMicroservice<MicroserviceOptions>({
    transport : Transport.KAFKA,
    options : {
      client : {
        clientId : 'ecommerce-ms',
        brokers : ['localhost:9092']
      },
      consumer: {
        groupId : 'ecommerce-cs'
      }
    }
  })
  

  await app.listen(port);
}
bootstrap();
