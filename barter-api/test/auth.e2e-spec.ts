import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth e2e', () => {
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

  it('/auth/signup (POST) - register new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'testuser@example.com',
        password: 'Test1234!',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201);

    expect(response.body.user.email).toEqual('testuser@example.com');
  });

  it('/auth/signin (POST) - login user', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'testuser@example.com',
        password: 'Test1234!',
      })
      .expect(200);
  });
});
