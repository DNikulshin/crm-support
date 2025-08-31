"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        schema: {
            example: {
                user: {
                    id: 'clp1234567890',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'USER',
                    isActive: true,
                    createdAt: '2023-12-01T10:00:00.000Z'
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User with this email already exists' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully logged in',
        schema: {
            example: {
                user: {
                    id: 'clp1234567890',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'USER',
                    isActive: true,
                    createdAt: '2023-12-01T10:00:00.000Z'
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map