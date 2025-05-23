import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateGlassesDto {
  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  stock: number;
}
