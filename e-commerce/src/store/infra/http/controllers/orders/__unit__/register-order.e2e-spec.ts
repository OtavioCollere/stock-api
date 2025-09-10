
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


describe('Register Order (E2E)', () => {
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

  it("[POST] /orders", async () => {

    const user = await userFactory.makePrismaUser({
      cpf : '11144477735',
      email : 'otavio@email.com',
      password : await hash('12345678910', 8),
    })

    const customer = await userFactory.makePrismaUser({
      cpf : '11144422235',
      name : 'customer',
      email : 'customer@email.com',
      password : await hash('12345678910', 8),
    })

    const category = await categoryFactory.makeCategory({ 
      createdBy : user.id
    })

    const access_token = jwt.sign({
      sub : customer.id.toString(),
      role: customer.role
    })

  
    let orderItems = []
    for (let c = 1; c <= 10; c++)
    {

      let product = await productFactory.makeProduct({
        name: `Produto ${c}`,
        productCode: "NB-12345",
        description: "Notebook gamer com RTX 4060",
        quantity: 10,
        currentPrice: 7500,
        categoryId: category.id,
        createdByUserId: user.id
      })

      orderItems.push({
        productId : product.id.toString(),
        quantity : 5,
        unitPrice : 100
      })
    
    }
    
    
    const result = await supertest(app.getHttpServer())
    .post('/orders')
    .send(
      {
        customerId : customer.id.toString(),
        orderItems: orderItems,
        deliveryAddress : 'Rua silva 123'
      }
    )
    .set('Authorization', `Bearer ${access_token}`)

    expect(result.statusCode).toBe(201)

  })

});