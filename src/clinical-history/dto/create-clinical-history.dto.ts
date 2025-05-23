import { IsArray, IsNotEmpty, IsString, Validate, MaxLength, Matches } from 'class-validator';
import { Vision } from './vision.dto';

export class CreateClinicalHistoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @Matches(/^[A-Za-z0-9]+$/, {
        message: 'El ID del cliente solo puede contener letras y números'
    })
    id_client: string;

    @IsArray()
    @IsNotEmpty()
    @Validate(Vision)
    av: string[];

    @IsArray()
    @IsNotEmpty()
    @Validate(Vision)
    sc: string[];

    @IsArray()
    @IsNotEmpty()
    @Validate(Vision)
    cc: string[];

    @IsArray()
    @IsNotEmpty()
    @Validate(Vision)
    ae: string[];
} 