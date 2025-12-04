import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateUserDto } from './dto/create.user.dto.js';
import { UpdateUserDto } from './dto/update.user.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...userData,
      },
    });

    return { message: 'User created successfully', data: user };
  }

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return { message: 'Users fetched successfully', data: users };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User fetched successfully', data: user };
  }

  async deleteUserById(id: string) {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully', data: deletedUser };
  }

  async updateUserById(id: string, newUserData: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: newUserData,
    });

    return { message: 'User updated successfully' };
  }
}
