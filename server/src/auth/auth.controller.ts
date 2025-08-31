import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}