import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { DatabaseModule } from '../database/database.module';
import { clientProviders } from './client.providers';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [DatabaseModule, SalesModule],
  providers: [
    ...clientProviders,
    ClientService
  ],
  controllers: [ClientController]
})
export class ClientModule {}
