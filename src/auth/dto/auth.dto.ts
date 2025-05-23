import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export enum Role {
    ADMIN = 'admin',
    SECRETARY = 'secretary'
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class RegisterDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEnum(Role)
    role: Role;
}
