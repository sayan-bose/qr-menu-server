import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { ConstructableEntity } from './common';

@ObjectType()
@Entity()
@Unique(['menuId', 'name'])
export class Table extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('uuid')
  userId!: string;

  @Field()
  @Column('uuid')
  menuId!: string;

  @Field()
  @Column()
  qrToken!: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
