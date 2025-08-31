
import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/store/infra/database/database.module';
import { PrismaService } from '@/store/infra/database/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import supertest from 'supertest';
import { CategoryFactory } from 'test/factories/make-category';
import { ProductFactory } from 'test/factories/make-product';
import {  UserFactory } from 'test/factories/make-user';


describe('Active Product  (E2E)', () => {
  let app : INestApplication
  let prisma : PrismaService
  let userFactory : UserFactory
  let productFactory : ProductFactory
  let categoryFactory : CategoryFactory
  let jwt : JwtService

  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [UserFactory, ProductFactory, CategoryFactory],
      }).compile();

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    productFactory = moduleRef.get(ProductFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  });

  it("[PATCH] /products", async () => {

    const user = await userFactory.makePrismaUser({
      cpf : '11144477735',
      email : 'otavio@email.com',
      password : await hash('12345678910', 8),
    })

    const category = await categoryFactory.makeCategory({ 
      createdBy : user.id
    })

    const access_token = jwt.sign({
      sub : user.id.toString(),
      role: user.role
    })

    const product = await productFactory.makeProduct({
      name: "Notebook Gamer",
      productCode: "NB-12345",
      description: "Notebook gamer com RTX 4060",
      quantity: 10,
      currentPrice: 7500,
      categoryId: category.id,
      createdByUserId: user.id
    })
    
    const result = await supertest(app.getHttpServer())
    .patch('/products/active')
    .send({
      productId: product.id.toString(),
      updateByUserId: user.id.toString()
    })
    .set('Authorization', `Bearer ${access_token}`)
    

    expect(result.statusCode).toEqual(201)
    expect(result.body).toEqual({
      productId : expect.any(String),
      status : 'active'
    })

  })

});
