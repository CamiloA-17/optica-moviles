import { IsNotEmpty, IsNumber, IsString, Min, MaxLength, Matches } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateGlassesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: 'La marca solo puede contener letras, números, espacios y guiones'
  })
  marca: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9\s\-]+$/, {
    message: 'El material solo puede contener letras, números, espacios y guiones'
  })
  material: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  stock: number;
}
