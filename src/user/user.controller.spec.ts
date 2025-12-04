import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}));

const user = {
  id: crypto.randomUUID(),
  name: 'Lil Uzi Vert',
  username: 'liluzivert',
  email: 'liluzivert@example.com',
  year: 1994,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue([user]),
            getUserById: jest.fn().mockResolvedValue(user),
            createUser: jest.fn().mockResolvedValue(user),
            deleteUserById: jest.fn().mockResolvedValue(user),
            updateUserById: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    const result = await controller.getUsers();
    expect(result).toEqual([user]);
  });

  it('should return a user by id', async () => {
    const result = await controller.getUserById(user.id);
    expect(result).toEqual(user);
  });

  it('should create a user', async () => {
    const result = await controller.createUser(user);
    expect(result).toEqual(user);
  });

  it('should delete a user by id', async () => {
    const result = await controller.deleteUserById(user.id);
    expect(result).toEqual(user);
  });

  it('should update a user by id', async () => {
    const result = await controller.updateUserById(user.id, user);
    expect(result).toEqual(user);
  });
});
