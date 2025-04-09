import { Injectable, Inject, NotFoundException, ConflictException, HttpStatus } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientService {
    constructor(
        @Inject('CLIENT_REPOSITORY')
        private clientRepository: Repository<Client>
    ) {}

    async create(clientData: Client): Promise<{ statusCode: number, message: string, client: Client }> {
        
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

    async removeClient(id: string): Promise<{ statusCode: number, message: string }> {
        const clientData = await this.findOneById(id);
        
        if (!clientData) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        await this.clientRepository.remove(clientData.client);
        return {
            statusCode: HttpStatus.OK,
            message: `Client with ID ${id} deleted successfully`
        };
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
