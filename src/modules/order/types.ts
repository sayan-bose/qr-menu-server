import { Order } from '../../entities/Order';
import { Field, InputType, ObjectType } from 'type-graphql';

import { QueryParams, MutationResponse, QueryResponse } from '../../types';
import { CreateOrderItemInput } from '../order-item/types';

export type OrderFilterFields = 'menuId' | 'tableId' | 'mobileNo' | 'sessionId';

export class OrderQueryParams extends QueryParams<Order, OrderFilterFields> {}

@ObjectType()
export class OrderQueryResponse extends QueryResponse<Order>(Order) {
  constructor(response: Partial<OrderQueryResponse>) {
    super(response);
  }
}

@ObjectType()
export class OrderMutationResponse extends MutationResponse(Order) {}

@InputType()
export class CreateOrderInput {
  @Field()
  menuId: string;

  @Field()
  tableId: string;

  @Field()
  mobileNo: string;

  @Field()
  sessionId: string;

  @Field(() => [CreateOrderItemInput])
  orderItems: CreateOrderItemInput[];
}
