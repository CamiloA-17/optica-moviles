import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'El nombre solo puede contener letras y espacios'
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'El apellido solo puede contener letras y espacios'
    })
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {
        message: 'El email debe tener un formato válido'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    @Matches(/^[0-9+\-\s()]+$/, {
        message: 'El teléfono solo puede contener números, +, -, (, ) y espacios'
    })
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @Matches(/^[A-Za-z0-9]+$/, {
        message: 'El ID solo puede contener letras y números'
    })
    id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    address: string;
} 