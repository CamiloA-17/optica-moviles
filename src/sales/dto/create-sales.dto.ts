import { IsNotEmpty, IsNumber, IsString, Min, Matches, MaxLength } from 'class-validator';

export class CreateSalesDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'El ID del cliente solo puede contener letras y números'
  })
  clientId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  glassesId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe estar en formato YYYY-MM-DD'
  })
  date: string;
}