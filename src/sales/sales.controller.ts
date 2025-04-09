import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sales } from './sales.entity';
import { CreateSalesDto } from './dto/create-sales.dto';
import { GlassesService } from '../glasses/glasses.service';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly glassesService: GlassesService,
  ) {}

  @Get()
  async findAll() {
    const sales = await this.salesService.findAll();
    return sales.map(sale => ({
      ...sale,
      glasses: sale.glasses ? {
        ...sale.glasses,
        imagen: `http://192.168.1.6:3000/${sale.glasses.imagen.replace(/\\/g, '/')}`
      } : null
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const sale = await this.salesService.findOne(id);
    return {
      ...sale,
      glasses: sale.glasses ? {
        ...sale.glasses,
        imagen: `http://192.168.1.6:3000/${sale.glasses.imagen.replace(/\\/g, '/')}`
      } : null
    };
  }

  @Post()
  async create(@Body() createSalesDto: CreateSalesDto) {
    try {
      const glasses = await this.glassesService.findOne(createSalesDto.glassesId);
      if (!glasses) {
        throw new BadRequestException('Las gafas especificadas no existen');
      }

      const sale = await this.salesService.create(createSalesDto);
      const createdSale = await this.salesService.findOne(sale.id);
      
      if (!createdSale || !createdSale.glasses) {
        throw new BadRequestException('Error al crear la venta');
      }

      return {
        id: createdSale.id,
        client: createdSale.client,
        glasses: {
          id: createdSale.glasses.id,
          marca: createdSale.glasses.marca,
          imagen: `http://192.168.1.6:3000/${createdSale.glasses.imagen}`,
          precio: createdSale.glasses.precio,
          material: createdSale.glasses.material,
          stock: createdSale.glasses.stock
        },
        total: createdSale.total,
        date: createdSale.date
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: {
    clientId?: string;
    glassesId?: number;
    total?: number;
    date?: string;
  }) {
    try {
      if (updateData.glassesId) {
        const glasses = await this.glassesService.findOne(updateData.glassesId);
        if (!glasses) {
          throw new BadRequestException('Las gafas especificadas no existen');
        }
      }

      const updatedSale = await this.salesService.update(id, updateData);
      const saleWithRelations = await this.salesService.findOne(id);
      
      return {
        ...saleWithRelations,
        glasses: saleWithRelations.glasses ? {
          ...saleWithRelations.glasses,
          imagen: `http://192.168.1.6:3000/${saleWithRelations.glasses.imagen.replace(/\\/g, '/')}`
        } : null
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.salesService.delete(id);
  }
}