import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'newuser@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe'
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'updated@example.com'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'Jane'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Smith'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User role (Admin only)',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User active status (Admin only)',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}