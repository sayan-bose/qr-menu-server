import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

type Config = {
  host?: string;
  port?: number;
  log?: any;
};

export const listen = (
  app: Express,
  apollo: ApolloServer,
  {
    host = process.env.HOST,
    port = parseInt(process.env.PORT || '4000', 10),
    log = console.log
  }: Config = {}
) => {
  app.listen(port, () =>
    log(`🚀 Server ready at http://${host}:${port}${apollo.graphqlPath}`)
  );
};
