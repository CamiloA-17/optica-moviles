import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSalesDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsNumber()
  glassesId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total: number;

  @IsNotEmpty()
  @IsString()
  date: string;

}