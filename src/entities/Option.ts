import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Item } from './Item';
import { ConstructableEntity } from './common';

@ObjectType()
@Entity()
export class Option extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  itemId!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  price!: number;

  @ManyToOne(() => Item, (item) => item.options)
  item: Item;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
