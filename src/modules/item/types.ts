import { ObjectType, Field, InputType } from 'type-graphql';

import { Item } from '../../entities';
import { QueryParams, MutationResponse, QueryResponse } from '../../types';
import { OptionInput } from '../option/types';

export type ItemFilterFields = 'categoryId' | 'menuId' | 'type';

export class ItemQueryParams extends QueryParams<Item, ItemFilterFields> {}

@ObjectType()
export class ItemQueryResponse extends QueryResponse<Item>(Item) {
  constructor(response: Partial<ItemQueryResponse>) {
    super(response);
  }
}

@ObjectType()
export class ItemMutationResponse extends MutationResponse(Item) {}

@InputType({ isAbstract: true })
abstract class ItemMutation {
  @Field()
  name: string;

  @Field(() => [OptionInput])
  options: OptionInput[];

  @Field()
  type: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class CreateItemInput extends ItemMutation {
  @Field()
  menuId!: string;

  @Field()
  categoryId!: string;
}

@InputType()
export class UpdateItemInput extends ItemMutation {
  @Field()
  id!: string;
}
