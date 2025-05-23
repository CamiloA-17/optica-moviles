import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sales } from './sales.entity';
import { Glasses } from '../glasses/entities/glasses.entity';
import { Client } from '../client/client.entity';
import { GlassesModule } from '../glasses/glasses.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Sales, Glasses, Client]),
    GlassesModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}
