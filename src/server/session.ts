import { Express } from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { Redis } from 'ioredis';
import { cookieName, __prod__ } from '../constants';

export const createSession = (app: Express, redis: Redis) => {
  const RedisStore = connectRedis(session);

  if (__prod__) {
    app.enable('trust proxy');
  }

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      name: cookieName,
      secret: String(process.env.SESSION_SECRET),
      cookie: {
        maxAge: 1000 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__
      },
      saveUninitialized: false,
      resave: false
    })
  );
};
