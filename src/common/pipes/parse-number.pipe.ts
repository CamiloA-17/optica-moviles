import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null) {
      return value;
    }

    const num = Number(value);
    if (isNaN(num)) {
      throw new BadRequestException('El valor debe ser un número válido');
    }

    return num;
  }
} 