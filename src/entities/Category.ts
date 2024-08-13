import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { Menu } from './Menu';
import { ConstructableEntity } from './common';

@ObjectType()
@Entity()
@Unique(['menuId', 'name'])
export class Category extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Column('uuid')
  menuId!: string;

  @Column('uuid')
  userId!: string;

  @Field(() => Menu, { nullable: true })
  @ManyToOne(() => Menu, (menu) => menu.categories)
  menu: Menu;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
