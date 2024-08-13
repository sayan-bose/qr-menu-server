import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Unique
} from 'typeorm';

import { Option } from './Option';
import { ConstructableEntity } from './common';

@ObjectType()
@Entity()
@Unique(['categoryId', 'name'])
export class Item extends ConstructableEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  categoryId!: string;

  @Column('uuid')
  menuId!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  type!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => [Option])
  @OneToMany(() => Option, (option) => option.item)
  options: Option[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
