import argon2 from 'argon2';
import { Resolver, Ctx, Arg, Mutation } from 'type-graphql';

import { Context } from '../../types';
import { cookieName, ERROR_CODES } from '../../constants';
import { UserRepository } from '../user/repository';
import {
  RegisterUserInput,
  LoginUserInput,
  UserMutationResponse
} from './types';
import { createFieldError } from '../../utils/error-helpers';

@Resolver()
export class AuthResolver {
  #userRepository = UserRepository.getRepository();

  @Mutation(() => UserMutationResponse)
  async register(
    @Arg('input') input: RegisterUserInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const response = new UserMutationResponse();

    const password = await argon2.hash(input.password);

    try {
      const user = await this.#userRepository.createAndSave({
        ...input,
        password
      });

      response.data = user;
    } catch (err) {
      if (err && err.code === ERROR_CODES.DB.UNIQUE_CONSTRAINT_ERROR) {
        response.errors = createFieldError('email', 'Email already exists');
      } else {
        response.error = 'Something went wrong!';
      }
    }

    req.session.userId = response.data ? response.data.id : '';

    return response;
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg('input') input: LoginUserInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const response = new UserMutationResponse();

    const { email, password } = input;

    try {
      const [list] = await this.#userRepository.findAndCount({
        email
      });

      if (!list.length) {
        response.errors = createFieldError('email', 'Email does not exists');

        return response;
      }

      const user = list[0];
      const valid = await argon2.verify(user.password, password);

      if (!valid) {
        response.errors = createFieldError('password', 'Invalid password');

        return response;
      }

      response.data = user;
    } catch (e) {
      response.error = 'Something went wrong!';
    }

    req.session.userId = response?.data?.id;

    return response;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err: unknown) => {
        res.clearCookie(cookieName);

        if (err) {
          resolve(err);
        }

        resolve(true);
      })
    );
  }
}
