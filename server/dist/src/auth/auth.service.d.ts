import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: true;
            createdAt: Date;
        };
        token: string;
    }>;
    validateUser(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    } | null>;
    private generateToken;
}
