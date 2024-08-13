import { ObjectType, Field, InputType } from 'type-graphql';

import { Table } from '../../entities';
import { QueryParams, MutationResponse, QueryResponse } from '../../types';

export type TableFilterFields = 'menuId' | 'userId';

export class TableQueryParams extends QueryParams<Table, TableFilterFields> {}

@ObjectType()
export class TableQueryResponse extends QueryResponse<Table>(Table) {
  constructor(response: Partial<TableQueryResponse>) {
    super(response);
  }
}

@ObjectType()
export class TableMutationResponse extends MutationResponse(Table) {}

@InputType()
export class CreateTableInput {
  @Field()
  name: string;

  @Field()
  menuId: string;
}
