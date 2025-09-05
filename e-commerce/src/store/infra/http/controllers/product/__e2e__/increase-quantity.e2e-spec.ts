
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


describe('Increase Quantity  (E2E)', () => {
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

  it("[PATCH] /products/increase-quantity", async () => {
    const user = await userFactory.makePrismaUser({
      cpf: '11144477735',
      email: 'otavio@email.com',
      password: await hash('12345678910', 8),
    });

    const category = await categoryFactory.makeCategory({
      createdBy: user.id,
    });

    const access_token = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    // Criamos o produto já ativo
    const product = await productFactory.makeProduct({
      name: 'Notebook Gamer',
      productCode: 'NB-12345',
      description: 'Notebook gamer com RTX 4060',
      quantity: 10,
      currentPrice: 7500,
      categoryId: category.id,
      createdByUserId: user.id,
      status: 'active',
    });

    const result = await supertest(app.getHttpServer()).patch('/products/increase-quantity')
    .send({
      productId: product.id.toString(),
      sellerId: user.id.toString(),
      reason: 'Test increase quantity',
      quantity: 5,
    })
    .set('Authorization', `Bearer ${access_token}`)

    expect(result.statusCode).toEqual(201)
    expect(result.body).toEqual({
      productId: product.id.toString(),
      sellerId: user.id.toString(),
      type: 'IN',
      reason: 'Test increase quantity',
    })
    
    // const stockMovementOnDatabase = await prisma.stockMovement.findFirst({
    //   where : {
    //     productId : product.id.toString()
    //   }
    // })

    // const productOnDatabase = await prisma.product.findFirst({
    //   where : {
    //     id : product.id.toString()
    //   }
    // })

    // expect(stockMovementOnDatabase?.quantity).toEqual(5)
    // expect(productOnDatabase?.quantity).toEqual(5)

  })

});
