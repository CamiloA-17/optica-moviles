import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceTokenDto {
  @IsNotEmpty()
  @IsString()
  expoPushToken: string;
}