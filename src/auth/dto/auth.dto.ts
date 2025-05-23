import { IsString, IsEmail, MinLength, IsEnum, Matches, MaxLength, IsNotEmpty } from 'class-validator';

export enum Role {
    ADMIN = 'admin',
    SECRETARY = 'secretary'
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @Matches(/^[A-Za-z0-9]+$/, {
        message: 'El ID solo puede contener letras y números'
    })
    id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'El nombre solo puede contener letras y espacios'
    })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}
