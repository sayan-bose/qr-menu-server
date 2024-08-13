import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { ConstructableEntity } from './common';
import { Order } from './Order';

@ObjectType()
@Entity()
export class OrderItem extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  orderId: string;

  @Field()
  @Column('uuid')
  itemId: string;

  @Field()
  @Column()
  itemName: string;

  @Field()
  @Column('uuid')
  optionId: string;

  @Field()
  @Column()
  optionName: string;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
