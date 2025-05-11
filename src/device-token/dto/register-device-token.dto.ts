import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceTokenDto {
  @IsNotEmpty()
  @IsString()
  expoPushToken: string;
}