import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';

describe('Lessons e2e', () => {
  let app: INestApplication;
  let lessonId: string;
  let instructorId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // ✅ Tworzymy użytkownika (instruktora)
    const userResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .field('email', `instructor-${Date.now()}@example.com`)
      .field('password', 'Test1234!')
      .field('firstName', 'Test')
      .field('lastName', 'Instructor')
      .attach('avatar', Buffer.from(''), 'avatar.png')
      .expect(201);

    // ✅ UWAGA: dwupoziomowy dostęp do ID!
    instructorId = userResponse.body.user.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/lessons (POST) - create a new lesson', async () => {
    const name = faker.lorem.words(3);
    const content = faker.lorem.sentences(2);

    const res = await request(app.getHttpServer())
      .post('/lessons')
      .field('name', name)
      .field('content', content)
      .field('categoryId', '1') // <-- dostosuj, jeśli nie masz kategorii o ID 1
      .field('instructorId', String(instructorId))
      .attach('photo', Buffer.from(''), 'photo.png')
      .attach('video', Buffer.from(''), 'video.mp4')
      .expect(201);

    lessonId = res.body.id;

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(name);
    expect(res.body.content).toEqual(content);
  });

  it('/lessons (GET) - get all lessons', async () => {
    const res = await request(app.getHttpServer())
      .get('/lessons')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/lessons/:id (GET) - get lesson by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/lessons/${lessonId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', lessonId);
  });

  it('/lessons/:id (PATCH) - update lesson', async () => {
    const newName = 'Updated Lesson Name';

    const res = await request(app.getHttpServer())
      .patch(`/lessons/${lessonId}`)
      .send({ name: newName })
      .expect(200);

    expect(res.body.name).toEqual(newName);
  });

  it('/lessons/:id (DELETE) - delete lesson', async () => {
    await request(app.getHttpServer())
      .delete(`/lessons/${lessonId}`)
      .expect(200);
  });
});


