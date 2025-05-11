import { Controller, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service'; 
import { DeviceTokenDto } from 'src/device-token/dto/register-device-token.dto'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerToken(
    @Request() req,
    @Body() registerDeviceTokenDto: DeviceTokenDto
  ) {
    const userId = req.user.userId; 
    return this.deviceTokenService.registerToken(
      userId,
      registerDeviceTokenDto.expoPushToken
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deactivate')
  async deactivateToken(
    @Request() req,
    @Body() deactivateTokenDto: DeviceTokenDto
  ) {
    const userId = req.user.userId; 
    return this.deviceTokenService.deactivateToken(
      deactivateTokenDto.expoPushToken,
      userId
    );
  }
  
}
