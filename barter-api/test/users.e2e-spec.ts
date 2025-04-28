import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) - get all users', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });
  it('/users/:id (GET) - get user by ID', async () => {
        const userId = 1; // Replace with a valid user ID in your database
        await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
    });
    
    it('/users/:id (DELETE) - delete user by ID', async () => {
        const userId = 1; // Replace with a valid user ID in your database
        await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200);
    });
});
    
    
    
