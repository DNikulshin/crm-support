"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(currentUserRole) {
        if (currentUserRole !== client_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only administrators can view all users');
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
    async findOne(id, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.id !== id) {
            throw new common_1.ForbiddenException('You can only view your own profile');
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async create(createUserDto, currentUserRole) {
        if (currentUserRole !== client_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only administrators can create users');
        }
        const { email, password, firstName, lastName, role } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: role || client_1.UserRole.USER,
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
    async update(id, updateUserDto, currentUser) {
        if (currentUser.role !== client_1.UserRole.ADMIN && currentUser.id !== id) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        if (currentUser.role !== client_1.UserRole.ADMIN) {
            delete updateUserDto.role;
            delete updateUserDto.isActive;
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (emailExists) {
                throw new common_1.ConflictException('Email already in use');
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
    async deactivate(id, currentUserRole) {
        if (currentUserRole !== client_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only administrators can deactivate users');
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map