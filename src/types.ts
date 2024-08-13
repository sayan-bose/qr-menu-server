import { Request, Response } from 'express';
import { GraphQLScalarType } from 'graphql';
import { Redis } from 'ioredis';
import { ClassType, Field, ObjectType } from 'type-graphql';

export type Context = {
  req: Request & { session: Record<string, any> };
  res: Response;
  redis: Redis;
};

export enum SessionStatus {
  CLOSED = 'closed',
  OCCUPIED = 'occupied',
  UNOCCUPIED = 'unoccupied',
  INVALID_ACCESS = 'invalid_access'
}

type Where<T, K extends keyof T> = Partial<Pick<T, K>>;
type OrderBy<T, K extends keyof T> = Record<K, 'DESC' | 'ASC'>;

export class QueryParams<T, K extends keyof T> {
  public skip?: number;
  public take?: number;
  public where?: Where<T, K>;
  public order?: OrderBy<T, K>;
}

export interface DatabaseOperations<T> {
  createAndSave(input: any): Promise<T | undefined>;
  getList(params: any): Promise<[T[], number]>;
  getById(id: string): Promise<T | undefined>;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

export function MutationResponse<TData>(TDataClass: ClassType<TData>) {
  @ObjectType({ isAbstract: true })
  abstract class MutationResponseClass {
    @Field(() => TDataClass, { nullable: true })
    data?: TData;

    @Field(() => String, { nullable: true })
    error?: string;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
  }

  return MutationResponseClass;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ItemsFieldValue<V> = ClassType<V> | GraphQLScalarType | String | Number;

export function QueryResponse<TItemsFieldValue>(
  itemsFieldValue: ItemsFieldValue<TItemsFieldValue>
) {
  @ObjectType({ isAbstract: true })
  abstract class QueryResponseClass {
    @Field(() => [itemsFieldValue], { defaultValue: [] })
    list: TItemsFieldValue[];

    @Field(() => Number, { defaultValue: 0 })
    count: number;

    @Field(() => String, { nullable: true })
    error?: string;

    constructor(response: Partial<QueryResponseClass> = {}) {
      return { ...this, ...response };
    }
  }

  return QueryResponseClass;
}
