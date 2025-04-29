import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Barters e2e', () => {
  let app: INestApplication;
  let accessToken: string;
  let lessonId: number;
  let offeredLessonId: number;
  let barterId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // ✅ Rejestracja użytkownika
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .field('email', `barteruser-${Date.now()}@example.com`)
      .field('password', 'Test1234!')
      .field('firstName', 'Barter')
      .field('lastName', 'User')
      .attach('avatar', Buffer.from(''), 'avatar.png')
      .expect(201);

    // ✅ Logowanie, pobranie accessToken
    const signinRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: signupRes.body.user.email,
        password: 'Test1234!',
      })
      .expect(200);

    accessToken = signinRes.body.accessToken;

    // ✅ Stwórz 2 lekcje (żeby barterować)
    const lesson1 = await request(app.getHttpServer())
      .post('/lessons')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'Lesson One')
      .field('content', 'Content One')
      .field('categoryId', '1') // <-- musisz mieć kategorię ID=1
      .field('instructorId', signupRes.body.user.id)
      .attach('photo', Buffer.from(''), 'photo.png')
      .attach('video', Buffer.from(''), 'video.mp4')
      .expect(201);

    lessonId = lesson1.body.id;

    const lesson2 = await request(app.getHttpServer())
      .post('/lessons')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'Lesson Two')
      .field('content', 'Content Two')
      .field('categoryId', '1')
      .field('instructorId', signupRes.body.user.id)
      .attach('photo', Buffer.from(''), 'photo2.png')
      .attach('video', Buffer.from(''), 'video2.mp4')
      .expect(201);

    offeredLessonId = lesson2.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/barters/sent (GET) - should require authentication', async () => {
    await request(app.getHttpServer())
      .get('/barters/sent')
      .expect(401);
  });

  it('/barters/propose-lessons (POST) - propose barter', async () => {
    const res = await request(app.getHttpServer())
      .post('/barters/propose-lessons')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        lessonId,
        offeredLessonId,
        message: 'I would like to barter!',
      })
      .expect(201);

    barterId = res.body.id;

    expect(res.body.status).toBe('PENDING');
  });

  it('/barters/sent (GET) - get sent barters', async () => {
    const res = await request(app.getHttpServer())
      .get('/barters/sent')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/barters/:id (GET) - get barter by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/barters/${barterId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', barterId);
    expect(res.body.status).toBe('PENDING');
  });

  it('/barters/:id/accept (POST) - accept barter', async () => {
    const res = await request(app.getHttpServer())
      .post(`/barters/${barterId}/accept`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.status).toBe('ACCEPTED');
  });
});

