import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module.js';
import { PrismaService } from 'src/prisma.service.js';
import { CreateUserDto } from 'src/user/dto/create.user.dto.js';
import request from 'supertest';

const dto: CreateUserDto = {
  email: 'nikita@gmail.com',
  name: 'Nikita',
  username: 'username',
  year: 2008,
};

describe('UserController', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('POST /user - should create user', async () => {
    const server = app.getHttpServer();

    await request(server)
      .post('/user')
      .send(dto)
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toBe('User created successfully');
        expect(body.data).toMatchObject(dto);
        expect(body.data.id).toBeDefined();
        expect(body.data.createdAt).toBeDefined();
        expect(body.data.updatedAt).toBeDefined();
      });
  });

  it('GET /user/:id - should return 404 if user it not found', async () => {
    await request(app.getHttpServer()).get('/user/not-existing-id').expect(404);
  });

  it('GET /user/:id - should get user by id', async () => {
    const uniqueDto = {
      email: 'test2@gmail.com',
      name: 'Test User',
      username: 'testuser2',
      year: 2005,
    };

    const created = await request(app.getHttpServer())
      .post('/user')
      .send(uniqueDto)
      .expect(201);

    const userId = created.body.data.id;

    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .expect(200);

    expect(response.body.message).toBe('User fetched successfully');
    expect(response.body.data).toMatchObject({
      id: userId,
      name: uniqueDto.name,
      username: uniqueDto.username,
      email: uniqueDto.email,
      year: uniqueDto.year,
    });
  });
});
