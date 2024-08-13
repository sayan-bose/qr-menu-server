import { InputType, Field } from 'type-graphql';

@InputType()
export class OptionInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  name!: string;

  @Field()
  price!: number;
}
