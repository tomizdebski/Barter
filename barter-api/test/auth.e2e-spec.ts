import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth e2e', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  it('/auth/signup (POST) - register new user WITH avatar', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .field('email', 'avataruser@example.com')
      .field('password', 'Test1234!')
      .field('firstName', 'Avatar')
      .field('lastName', 'User')
      .attach('avatar', Buffer.from('fake-image'), 'avatar.png') // symulowany plik
      .expect(201);

    expect(response.body.user.email).toEqual('avataruser@example.com');
    expect(response.body.user.avatar).toContain('uploads/');
  });

  it('/auth/signin (POST) - login user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'testuser@example.com',
        password: 'Test1234!',
      })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
    accessToken = response.body.accessToken;
  });

  it('/auth/me (GET) - get current user info', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.email).toEqual('testuser@example.com');
  });

  it('/auth/signout (GET) - sign out user', async () => {
    await request(app.getHttpServer())
      .get('/auth/signout')
      .expect(200);
  });
});


