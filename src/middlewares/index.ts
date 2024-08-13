import { MiddlewareFn } from 'type-graphql';

import { Context } from '../types';
import { ERROR_MESSAGES } from '../constants';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  return next();
};
