import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './users.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async findOne(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user || undefined;
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async create(userData: User): Promise<User> {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    async findOneById(id: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<{ statusCode: number, message: string }> {
        const user = await this.findOneById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (updateData.password) {
            return {
                statusCode: 400,
                message: 'Password cannot be updated directly'
            }
        }

        if (updateData.email) {
            const existingUser = await this.userRepository.findOne({ where: { email: updateData.email, id: Not(id) } });
            if (existingUser) {
                return {
                    statusCode: 409,
                    message: 'Email already in use'
                }
            }
        }

        Object.assign(user, updateData);
        await this.userRepository.save(user);
        return {
            statusCode: 200,
            message: `User with ID ${id} updated successfully`
        };
    }

    async removeUser(id: string): Promise<{ statusCode: number, message: string }> {
        const user = await this.findOneById(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.userRepository.remove(user);
        return {
            statusCode: 200,
            message: `User with ID ${id} deleted successfully`
        };
    }
}
