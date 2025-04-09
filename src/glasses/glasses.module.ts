import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlassesService } from './glasses.service';
import { GlassesController } from './glasses.controller';
import { Glasses } from './entities/glasses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Glasses])],
  controllers: [GlassesController],
  providers: [GlassesService],
  exports: [GlassesService],
})
export class GlassesModule {} 