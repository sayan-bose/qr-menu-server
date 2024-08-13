import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { OrderItem } from './OrderItem';

import { ConstructableEntity } from './common';

@ObjectType()
@Entity()
export class Order extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('uuid')
  menuId!: string;

  @Field()
  @Column('uuid')
  tableId!: string;

  @Field()
  @Column()
  mobileNo!: string;

  @Field()
  @Column('uuid')
  sessionId!: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
