import { ObjectType, Field, InputType } from 'type-graphql';

import { Category } from '../../entities';
import { QueryParams, QueryResponse, MutationResponse } from '../../types';

export type CategoryFilterFields = 'userId' | 'menuId';

export class CategoryQueryParams extends QueryParams<
  Category,
  CategoryFilterFields
> {}

@ObjectType()
export class CategoryQueryResponse extends QueryResponse<Category>(Category) {
  constructor(response: Partial<CategoryQueryResponse>) {
    super(response);
  }
}

@ObjectType()
export class CategoryMutationResponse extends MutationResponse(Category) {}

@InputType({ isAbstract: true })
abstract class CategoryMutation {
  @Field()
  name: string;

  @Field()
  menuId: string;
}

@InputType()
export class CreateCategoryInput extends CategoryMutation {}
