import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Glasses } from './entities/glasses.entity';
import { CreateGlassesDto } from './dto/create-glasses.dto';
import { UpdateGlassesDto } from './dto/update-glasses.dto';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_IMAGE = 'uploads/glasses/default-glasses.jpg';

@Injectable()
export class GlassesService {
  constructor(
    @InjectRepository(Glasses)
    private glassesRepository: Repository<Glasses>,
  ) {}

  async create(createGlassesDto: CreateGlassesDto): Promise<Glasses> {
    const glasses = this.glassesRepository.create(createGlassesDto);
    return await this.glassesRepository.save(glasses);
  }

  async findAll(): Promise<Glasses[]> {
    return await this.glassesRepository.find();
  }

  async findOne(id: number): Promise<Glasses> {
    const glasses = await this.glassesRepository.findOne({ where: { id } });
    if (!glasses) {
      throw new NotFoundException(`Glasses with ID ${id} not found`);
    }
    return glasses;
  }

  async update(id: number, updateGlassesDto: any): Promise<Glasses> {
    const glasses = await this.findOne(id);
    
    // Actualizar los campos
    Object.assign(glasses, updateGlassesDto);
    
    return await this.glassesRepository.save(glasses);
  }

  async removeMultiple(ids: number[]): Promise<{ deleted: number, notFound: number[] }> {
    const notFound: number[] = [];
    let deleted = 0;

    for (const id of ids) {
      try {
        const glasses = await this.findOne(id);
        
        // Eliminar la imagen del sistema de archivos solo si no es la imagen por defecto
        if (glasses.imagen && glasses.imagen !== DEFAULT_IMAGE) {
          const imagePath = path.resolve(glasses.imagen);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        
        await this.glassesRepository.delete(id);
        deleted++;
      } catch (error) {
        if (error instanceof NotFoundException) {
          notFound.push(id);
        } else {
          throw error;
        }
      }
    }

    return { deleted, notFound };
  }

  async remove(id: number): Promise<void> {
    const glasses = await this.findOne(id);
    
    // Eliminar la imagen del sistema de archivos solo si no es la imagen por defecto
    if (glasses.imagen && glasses.imagen !== DEFAULT_IMAGE) {
      const imagePath = path.resolve(glasses.imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    const result = await this.glassesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Glasses with ID ${id} not found`);
    }
  }
} 