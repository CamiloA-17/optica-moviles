import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './sales.entity';
import { CreateSalesDto } from './dto/create-sales.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales)
    private readonly salesRepository: Repository<Sales>,
  ) {}

  async findAll(): Promise<Sales[]> {
    return this.salesRepository.find({ relations: ['client', 'glasses'] });
  }

  async findOne(id: number): Promise<Sales> {
    const sale = await this.salesRepository.findOne({ where: { id }, relations: ['client', 'glasses'] });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async create(sale: CreateSalesDto): Promise<Sales> {
    const newSale = this.salesRepository.create({
      client: { id: sale.clientId },
      glasses: { id: sale.glassesId },
      total: sale.total,
      date: sale.date
    });
    return this.salesRepository.save(newSale);
  }

  async update(id: number, updateData: {
    clientId?: string;
    glassesId?: number;
    total?: number;
    date?: string;
  }): Promise<Sales> {
    const sale = await this.findOne(id);
    const updatedData = {
      ...updateData,
      glasses: updateData.glassesId ? { id: updateData.glassesId } : sale.glasses,
      client: updateData.clientId ? { id: updateData.clientId } : sale.client
    };
    Object.assign(sale, updatedData);
    return this.salesRepository.save(sale);
  }

  async delete(id: number): Promise<void> {
    const result = await this.salesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
  }
}