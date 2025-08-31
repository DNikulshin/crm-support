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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const user_dto_1 = require("./dto/user.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const client_1 = require("@prisma/client");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto, user) {
        return this.usersService.create(createUserDto, user.role);
    }
    findAll(user) {
        return this.usersService.findAll(user.role);
    }
    findOne(id, user) {
        return this.usersService.findOne(id, user);
    }
    update(id, updateUserDto, user) {
        return this.usersService.update(id, updateUserDto, user);
    }
    deactivate(id, user) {
        return this.usersService.deactivate(id, user.role);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user (Admin only)' }),
    (0, swagger_1.ApiBody)({ type: user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User with this email already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all users' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only view own profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: user_dto_1.UpdateUserDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Can only update own profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate user (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully deactivated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivate", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map