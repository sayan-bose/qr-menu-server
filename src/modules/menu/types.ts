import { ObjectType, Field, InputType } from 'type-graphql';

import { Menu } from '../../entities';
import { QueryParams, QueryResponse, MutationResponse } from '../../types';

export type MenuFilterFields = 'userId';

export class MenuQueryParams extends QueryParams<Menu, MenuFilterFields> {}

@ObjectType()
export class MenuQueryResponse extends QueryResponse<Menu>(Menu) {
  constructor(response: Partial<MenuQueryResponse>) {
    super(response);
  }
}

@ObjectType()
export class MenuMutationResponse extends MutationResponse(Menu) {}

@InputType({ isAbstract: true })
abstract class MenuMutation {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class CreateMenuInput extends MenuMutation {}
