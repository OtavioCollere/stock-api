
import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/store/infra/database/database.module';
import { PrismaService } from '@/store/infra/database/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import supertest from 'supertest';
import { makeUser, UserFactory } from 'test/factories/make-user';


describe('Authenticate  (E2E)', () => {
  let app : INestApplication
  let prisma : PrismaService
  let userFactory : UserFactory
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [UserFactory],
      }).compile();

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  });

  it("[POST] /sessions", async () => {

    await userFactory.makePrismaUser({
      cpf : '11144477735',
      email : 'otavio@email.com',
      password : await hash('1234', 8),
    })
    
    const result = await supertest(app.getHttpServer())
    .post('/sessions')
    .send({
      email : 'otavio@email.com',
      password : '1234',
    })

    console.log(result.body)
    expect(result.status).toEqual(201);
    expect(result.body).toEqual({
      access_token : expect.any(String),
      refresh_token : expect.any(String)
    })
  })

});
