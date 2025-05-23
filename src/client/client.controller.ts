import { Body, Controller, Delete, Get, Param, Post, Put, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.entity';

@Controller('clients')
export class ClientController {

    constructor(private clientsService: ClientService) {}

    @Post()
    async create(@Body() client: Client) {
        return this.clientsService.create(client);
    }

    @Get()
    async findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.clientsService.findOneById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<Client>) {
        return this.clientsService.updateClient(id, updateData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.clientsService.removeClient(id);
        
        if (result.hasSales) {
            return {
                statusCode: HttpStatus.CONFLICT,
                message: result.message,
                hasSales: true,
                salesIds: result.salesIds
            };
        }

        return {
            statusCode: HttpStatus.OK,
            message: result.message
        };
    }

}