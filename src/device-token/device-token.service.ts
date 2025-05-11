import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from './device-token.entity';

@Injectable()   
export class DeviceTokenService {
    constructor(
        @InjectRepository(DeviceToken)
        private deviceTokenRepository: Repository<DeviceToken>,
    ) { }

    async registerToken(userId: string, expoPushToken: string) {
        const existingToken = await this.deviceTokenRepository.findOne({
            where: { expoPushToken, userId }
        });

        if (existingToken) {
            existingToken.expoPushToken = expoPushToken;
            existingToken.isActive = true;
            return this.deviceTokenRepository.save(existingToken);
        }

        const newToken = this.deviceTokenRepository.create({
            userId,
            expoPushToken,
        });

        return this.deviceTokenRepository.save(newToken);
    }

    async getActiveTokensByUserId(userId: string) {
        return this.deviceTokenRepository.find({
            where: { userId, isActive: true }
        });
    }

    async deactivateToken(expoPushToken: string, userId: string) {
        const token = await this.deviceTokenRepository.findOne({
            where: { expoPushToken, userId }
        });

        if (token) {
            token.isActive = false;
            return this.deviceTokenRepository.save(token);
        }
    }
}