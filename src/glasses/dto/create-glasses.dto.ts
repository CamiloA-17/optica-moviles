import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGlassesDto {
  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
} 