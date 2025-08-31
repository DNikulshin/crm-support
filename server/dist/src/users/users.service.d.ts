import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(currentUserRole: UserRole): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            createdTickets: number;
            assignedTickets: number;
        };
    }[]>;
    findOne(id: string, currentUser: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            createdTickets: number;
            assignedTickets: number;
        };
    }>;
    create(createUserDto: CreateUserDto, currentUserRole: UserRole): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deactivate(id: string, currentUserRole: UserRole): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        updatedAt: Date;
    }>;
}
