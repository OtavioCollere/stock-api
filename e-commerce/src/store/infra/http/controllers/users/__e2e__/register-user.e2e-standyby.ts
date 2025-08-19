
// import { AppModule } from '@/app.module';
// import { isRight } from '@/store/core/either/either';
// import { DatabaseModule } from '@/store/infra/database/database.module';
// import { PrismaService } from '@/store/infra/database/prisma.service';
// import type { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import supertest from 'supertest';


// describe('Register  (E2E)', () => {
//   let app : INestApplication
//   let prisma : PrismaService

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//         imports: [AppModule, DatabaseModule],
//         providers: [],
//       }).compile();

//     app = moduleRef.createNestApplication()

//     prisma = moduleRef.get(PrismaService)

//     await app.init()
//   });

//   it("[POST] /users", async () => {
    
//     const result = await supertest(app.getHttpServer())
//     .post('/users')
//     .send({
//       name : 'Otavio',
//       cpf : '11144477735',
//       email : 'otavio@email.com',
//       password : '1234',
//       role : 'customer',
//       phone : '41996882727',
//       birthDate : '2003-10-16'
//     })
    
//     const userOnDatabase = await prisma.user.findUnique({
//       where : {
//         cpf : '11144477735'
//       }
//     })

//     expect(result.status).toBe(201) 
//     expect(result.body).toEqual({
//       user : { id : expect.any(String) }
//     })
//     expect(userOnDatabase).toBeDefined()

//   })

// });
