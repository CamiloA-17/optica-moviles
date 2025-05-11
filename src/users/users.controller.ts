import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
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
    removeUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}