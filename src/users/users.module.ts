import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './users.providers';
import { UsersController } from './users.controller';
import { DeviceTokenModule } from '../device-token/device-token.module';

@Module({
  imports: [DatabaseModule, DeviceTokenModule],
  controllers: [UsersController],
  providers: [
    ...userProviders,
    UsersService
  ],
  exports: [UsersService]
})
export class UsersModule {}
