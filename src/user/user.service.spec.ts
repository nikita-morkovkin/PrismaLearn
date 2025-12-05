import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service.js';
import { CreateUserDto } from './dto/create.user.dto.js';
import { UpdateUserDto } from './dto/update.user.dto.js';
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

type PrismaServiceMock = {
  user: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaServiceMock;

  const dbMockModule: PrismaServiceMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const user = {
    id: 'user-1',
    name: 'Lil Uzi Vert',
    username: 'liluzivert',
    email: 'liluzivert@example.com',
    year: 1994,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: dbMockModule,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = dbMockModule;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize currectly', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: user.name,
      username: user.username,
      email: user.email,
      year: user.year,
    };
    prisma.user.create.mockResolvedValue(user);

    const result = await service.createUser(dto);

    expect(prisma.user.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual({
      message: 'User created successfully',
      data: user,
    });
  });

  it('should return all users', async () => {
    prisma.user.findMany.mockResolvedValue([user]);

    const result = await service.getUsers();

    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      message: 'Users fetched successfully',
      data: [user],
    });
  });

  it('should get user by id', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.getUserById(user.id);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(result).toEqual({
      message: 'User fetched successfully',
      data: user,
    });
  });

  it('should throw NotFoundException when user is missing', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getUserById(user.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete user by id', async () => {
    prisma.user.delete.mockResolvedValue(user);

    const result = await service.deleteUserById(user.id);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(result).toEqual({
      message: 'User deleted successfully',
      data: user,
    });
  });

  it('should throw NotFoundException when delete returns null', async () => {
    prisma.user.delete.mockResolvedValue(null as unknown as typeof user);

    await expect(service.deleteUserById(user.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update user data', async () => {
    const dto: UpdateUserDto = { name: 'New Name' };
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.update.mockResolvedValue({ ...user, ...dto });

    const result = await service.updateUserById(user.id, dto);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: dto,
    });
    expect(result).toEqual({ message: 'User updated successfully' });
  });

  it('should throw NotFoundException when updating missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.updateUserById(user.id, {})).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
