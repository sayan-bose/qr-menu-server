import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from './Category';
import { ConstructableEntity } from './common';

@ObjectType()
@Entity()
export class Menu extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field()
  @Column('uuid')
  userId!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Category, (category) => category.menu)
  categories: Category[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
