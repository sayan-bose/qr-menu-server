import { createConnection } from 'typeorm';
import path from 'path';

import entities from '../../entities';
import { MAX_RETRY, __prod__ } from '../../constants';
import { sleep } from '../../utils/promise-helpers';
import { getPostgresUrl } from '../../utils/url-helpers';

const checkRetries = async (retries: number, msg: string) => {
  let retriesLeft = retries;

  retriesLeft -= 1;

  await sleep();

  if (!retriesLeft) {
    throw new Error(msg);
  }
};

async function connectDB(maxRetries: number = MAX_RETRY) {
  const retries = maxRetries;

  while (retries) {
    try {
      const connection = await createConnection({
        type: 'postgres',
        url: getPostgresUrl({
          host: process.env.POSTGRES_HOST,
          port: process.env.POSTGRES_PORT || 5432,
          user: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD,
          db: process.env.POSTGRES_DB
        }),
        migrations: [path.join(__dirname, '../../migrations/*')],
        entities,
        synchronize: !__prod__,
        logging: !__prod__
      });

      if (__prod__) {
        await connection.runMigrations();
      }

      break;
    } catch (e) {
      await checkRetries(retries, 'Database connection failed');
    }
  }
}

export { connectDB };
