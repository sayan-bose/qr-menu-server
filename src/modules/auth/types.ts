import { Field, InputType, ObjectType } from 'type-graphql';

import { User } from '../../entities';
import { MutationResponse } from '../../types';

@ObjectType()
export class UserMutationResponse extends MutationResponse(User) {}

@InputType({ isAbstract: true })
abstract class UserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterUserInput extends UserInput {
  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field({ nullable: true })
  phone?: string;
}

@InputType()
export class LoginUserInput extends UserInput {}
