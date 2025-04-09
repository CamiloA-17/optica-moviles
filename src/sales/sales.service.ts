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

  async update(id: number, updateData: Partial<Sales>): Promise<Sales> {
    const sale = await this.findOne(id);
    Object.assign(sale, updateData);
    return this.salesRepository.save(sale);
  }

  async delete(id: number): Promise<void> {
    const result = await this.salesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
  }
}