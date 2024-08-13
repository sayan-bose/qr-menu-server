import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateOrderItemInput {
  @Field()
  itemId: string;

  @Field()
  itemName: string;

  @Field()
  optionId: string;

  @Field()
  optionName: string;

  @Field()
  price: number;

  @Field()
  quantity: number;
}
