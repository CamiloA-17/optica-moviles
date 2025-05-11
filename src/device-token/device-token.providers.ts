import { DataSource } from 'typeorm';
import { DeviceToken } from './device-token.entity';

export const deviceTokenProviders = [
    {
        provide: 'DEVICE_TOKEN_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(DeviceToken),
        inject: ['DATA_SOURCE'],
    },
];
