import { Resolver, Query, Ctx } from 'type-graphql';

import { Context } from '../../types';
import { User } from '../../entities';
import { UserRepository } from './repository';

@Resolver(User)
export class UserResolver {
  #userRepository = UserRepository.getRepository();

  @Query(() => User, { nullable: true })
  async userInfo(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null;
    }

    try {
      return await this.#userRepository.getById(req.session.userId);
    } catch (err) {
      throw new Error(err);
    }
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const [list] = await this.#userRepository.getList();

    return list;
  }
}
