import { Field, InputType, ObjectType } from 'type-graphql';

import { MutationResponse, SessionStatus } from '../../types';

@ObjectType()
export class TableSession {
  @Field({ nullable: true })
  sessionId?: string;

  @Field({ nullable: true })
  accessKey?: string;

  @Field(() => SessionStatus, { nullable: true })
  status?: SessionStatus;
}

@ObjectType()
export class TableSessionMutationResponse extends MutationResponse(
  TableSession
) {}

@InputType()
export class CreateTableSessionInput {
  @Field()
  tableId: string;

  @Field()
  menuId: string;

  @Field({ nullable: true })
  sessionId?: string;

  @Field({ nullable: true })
  guestKey?: string;
}
