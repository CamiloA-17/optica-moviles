import { Injectable, Inject, NotFoundException, ConflictException, HttpStatus } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { Client } from './client.entity';
import { SalesService } from '../sales/sales.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @Inject('CLIENT_REPOSITORY')
        private clientRepository: Repository<Client>,
        private salesService: SalesService
    ) {}

    async create(clientData: CreateClientDto): Promise<{ statusCode: number, message: string, client: Client }> {
        const existingClient = await this.clientRepository.findOne({
            where: [
                { email: clientData.email },
                { phone: clientData.phone }
            ]
        });

        if (existingClient) {
            throw new ConflictException('Ya existe un cliente con ese email o teléfono');
        }

        const client = this.clientRepository.create(clientData);
        await this.clientRepository.save(client);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Cliente creado correctamente',
            client: client
        };
    }

    async findAll(): Promise<{ statusCode: number, message: string, clients: Client[] }> {
        const clients = await this.clientRepository.find();
        return {
            statusCode: HttpStatus.OK,
            message: 'Clientes encontrados correctamente',
            clients: clients
        };
    }

    async findOneById(id: string): Promise<{ statusCode: number, message: string, client: Client }> {
            const client = await this.clientRepository.findOne({ where: { id } });

            if (!client) {
                throw new NotFoundException(`Client with ID ${id} not found`);
            }
            return {
                statusCode: HttpStatus.OK,
                message: 'Client found successfully',
                client: client
            };
        }


    async updateClient(id: string, updateData: Partial<Client>): Promise<{ statusCode: number, message: string }> {
        const clientData = await this.findOneById(id);

        if (updateData.email) {
            const existingClient = await this.clientRepository.findOne({
                where: [
                    { email: updateData.email, id: Not(id) },
                    { phone: updateData.phone, id: Not(id) }
                ]
            });
            if (existingClient) {
                throw new ConflictException('Ya existe un cliente con ese email o teléfono');
            }
        }

        Object.assign(clientData.client, updateData);
        await this.clientRepository.save(clientData.client);
        return {
            statusCode: HttpStatus.OK,
            message: 'Cliente actualizado correctamente'
        };
    }

    async removeClient(id: string): Promise<{ statusCode: number, message: string, hasSales?: boolean, salesIds?: number[] }> {
        const clientData = await this.findOneById(id);
        
        if (!clientData) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }

        try {
            // Verificar si el cliente tiene ventas asociadas
            const allSales = await this.salesService.findAll();
            const clientSales = allSales.filter(sale => sale.client.id === id);

            if (clientSales.length > 0) {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: 'No se puede eliminar el cliente porque tiene ventas asociadas. Por favor, elimine primero las ventas asociadas a este cliente.',
                    hasSales: true,
                    salesIds: clientSales.map(sale => sale.id)
                };
            }

            await this.clientRepository.remove(clientData.client);
            return {
                statusCode: HttpStatus.OK,
                message: `Cliente con ID ${id} eliminado exitosamente`
            };
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: 'No se puede eliminar el cliente porque tiene ventas asociadas. Por favor, elimine primero las ventas asociadas a este cliente.',
                    hasSales: true
                };
            }
            throw error;
        }
    }

    // async removeUser(id: string): Promise<{ statusCode: number, message: string }> {
    //     const user = await this.findOneById(id);

    //     if (!user) {
    //         throw new NotFoundException(`User with ID ${id} not found`);
    //     }

    //     await this.userRepository.remove(user);
    //     return {
    //         statusCode: 200,
    //         message: `User with ID ${id} deleted successfully`
    //     };
    // }

}
