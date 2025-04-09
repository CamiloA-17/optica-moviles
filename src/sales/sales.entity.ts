import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Glasses } from '../glasses/entities/glasses.entity';
import { Client } from '../client/client.entity';

@Entity('sales')
export class Sales {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Glasses)
  @JoinColumn({ name: 'glassesId' })
  glasses: Glasses;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column()
  date: string;
}