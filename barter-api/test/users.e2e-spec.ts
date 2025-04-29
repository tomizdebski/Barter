import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { faker } from '@faker-js/faker'; // <- dodaj faker do generowania danych

describe('Users e2e', () => {
  let app: INestApplication;
  let userId: number;
  let email: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  
    email = `e2euser-${faker.number.int({ min: 1000, max: 9999 })}@example.com`;
  
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .field('firstName', 'E2E')
      .field('lastName', 'User')
      .field('email', email)
      .field('password', 'Test1234!')
      .attach('avatar', Buffer.from(''), 'avatar.png')
      .expect(201);
  
    console.log('Signup response:', res.body);
  
    userId = res.body.user.user.id;      // <-- poprawka tutaj
    email = res.body.user.user.email;    // <-- i tutaj
  });
  

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) - get all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/users/:id (GET) - get user by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(res.body.id).toEqual(userId);
    expect(res.body.email).toEqual(email);
  });

  it('/users/:id (DELETE) - delete user by ID', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200);
  });
});

