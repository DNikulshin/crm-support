import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUserRole: UserRole) {
    // Only admins can view all users
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can view all users');
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdTickets: true,
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, currentUser: any) {
    // Users can only view their own profile, admins can view any profile
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdTickets: true,
            assignedTickets: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto, currentUserRole: UserRole) {
    // Only admins can create users
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can create users');
    }

    const { email, password, firstName, lastName, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: any) {
    // Users can only update their own profile (except role and isActive)
    // Admins can update any user
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Non-admins cannot change role or isActive status
    if (currentUser.role !== UserRole.ADMIN) {
      delete updateUserDto.role;
      delete updateUserDto.isActive;
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deactivate(id: string, currentUserRole: UserRole) {
    // Only admins can deactivate users
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can deactivate users');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}