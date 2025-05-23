import { Body, Controller, Delete, Get, Param, Put, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOneById(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() updateData: Partial<User>) {
        return this.usersService.updateUser({ id, ...updateData });
    }

    @Delete(':id')
    async removeUser(@Param('id') id: string) {
        try {
            const result = await this.usersService.deleteUser(id);
            return {
                statusCode: HttpStatus.OK,
                message: result.message
            };
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            };
        }
    }
}