import express from 'express';
import Redis from 'ioredis';

import { createSession } from '../session';
import { addCors } from '../cors';
import { initApolloServer } from '../apollo';
import { listen } from '../listen';
import { getRedisUrl } from '../../utils/url-helpers';

export const createApp = async () => {
  const app = express();
  const redis = new Redis(
    getRedisUrl({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    })
  );

  createSession(app, redis);
  addCors(app);

  const apollo = await initApolloServer(app, redis);

  listen(app, apollo);
};
