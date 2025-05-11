import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './device-token.entity'; 
import { DeviceTokenService } from './device-token.service'; 
import { DeviceTokenController } from './device-token.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService],
  exports: [DeviceTokenService]
})
export class DeviceTokenModule {}