import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    isActive?: boolean;
}
