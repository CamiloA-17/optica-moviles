import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('glasses')
export class Glasses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  imagen: string;

  @Column()
  precio: number;

  @Column()
  material: string;

  @Column()
  stock: number;
} 