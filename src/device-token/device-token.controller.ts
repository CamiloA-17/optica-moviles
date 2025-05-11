import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service'; 
import { RegisterDeviceTokenDto } from 'src/device-token/dto/register-device-token.dto'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerToken(
    @Request() req,
    @Body() registerDeviceTokenDto: RegisterDeviceTokenDto
  ) {
    const userId = req.user.userId; 
    return this.deviceTokenService.registerToken(
      userId,
      registerDeviceTokenDto.expoPushToken
    );
  }
}
