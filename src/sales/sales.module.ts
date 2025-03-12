import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sales } from './sales.entity';
import { Glasses } from '../glasses/entities/glasses.entity';
import { Client } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales, Glasses, Client])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}