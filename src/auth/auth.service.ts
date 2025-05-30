import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async decodeToken(token: string): Promise<any> {
        try {
            return this.jwtService.decode(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: LoginDto) {
        const userFound = await this.validateUser(user.email, user.password);
        if (!userFound) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: userFound.email, sub: userFound.id, role: userFound.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findOne(registerDto.email);
        
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        const { password, ...result } = user;
        return result;
    }
}
