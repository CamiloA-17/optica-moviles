import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GlassesService } from './glasses.service';
import { CreateGlassesDto } from './dto/create-glasses.dto';
import { UpdateGlassesDto } from './dto/update-glasses.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { ParseNumberPipe } from '../common/pipes/parse-number.pipe';

const DEFAULT_IMAGE = 'uploads/glasses/default-glasses.jpg';

@Controller('glasses')
export class GlassesController {
  constructor(private readonly glassesService: GlassesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/glasses',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  async create(
    @Body() createGlassesDto: CreateGlassesDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false, // La imagen es opcional
      }),
    ) file?: Express.Multer.File,
  ) {
    try {
      // Crear un nuevo objeto con los valores convertidos
      const glassesData = {
        ...createGlassesDto,
        imagen: file ? file.path : DEFAULT_IMAGE
      };

      return await this.glassesService.create(glassesData);
    } catch (error) {
      console.error('Error creating glasses:', error);
      throw new BadRequestException('Error al crear las gafas: ' + error.message);
    }
  }

  @Get()
  async findAll() {
    const glasses = await this.glassesService.findAll();
    // Modificar las rutas de las imágenes para que sean URLs completas
    return glasses.map(glass => ({
      ...glass,
      imagen: `https://optica-moviles.up.railway.app/${glass.imagen}` // Ajusta la URL base según tu configuración
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.glassesService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/glasses',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() updateGlassesDto: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false, // La imagen es opcional
      }),
    ) file?: Express.Multer.File,
  ) {
    try {
      // Usar el ParseNumberPipe para convertir los valores
      const parseNumberPipe = new ParseNumberPipe();
      const precio = updateGlassesDto.precio ? parseNumberPipe.transform(updateGlassesDto.precio) : undefined;
      const stock = updateGlassesDto.stock ? parseNumberPipe.transform(updateGlassesDto.stock) : undefined;

      // Crear un nuevo objeto con los valores convertidos
      const glassesData = {
        marca: updateGlassesDto.marca,
        material: updateGlassesDto.material,
        ...(precio !== undefined && { precio }),
        ...(stock !== undefined && { stock }),
      };

      // Si se proporciona una nueva imagen, actualizar la ruta
      if (file) {
        // Obtener la gafa actual para eliminar la imagen anterior
        const currentGlasses = await this.glassesService.findOne(+id);
        
        // Eliminar la imagen anterior si existe
        if (currentGlasses.imagen) {
          const oldImagePath = path.resolve(currentGlasses.imagen);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // Actualizar la ruta de la imagen
        glassesData['imagen'] = file.path;
      }

      return await this.glassesService.update(+id, glassesData);
    } catch (error) {
      console.error('Error updating glasses:', error);
      throw new BadRequestException('Error al actualizar las gafas: ' + error.message);
    }
  }

  @Delete()
  removeMultiple(@Body() data: { ids: number[] }) {
    if (!data.ids || !Array.isArray(data.ids) || data.ids.length === 0) {
      throw new BadRequestException('Se requiere un array de IDs válido');
    }
    return this.glassesService.removeMultiple(data.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.glassesService.remove(+id);
  }
} 