import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Redis } from 'ioredis';

import resolvers from '../../resolvers';
import { Context } from '../../types';

async function initApolloServer(
  app: Express,
  redis: Redis
): Promise<ApolloServer> {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      validate: false,
    }),
    context: ({ req, res }): Context => ({
      req,
      res,
      redis,
    }),
    introspection: true,
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  return apolloServer;
}

export { initApolloServer };
