type URLGenerator = (options: DBOptions) => string;

const URLGeneratorMap: Record<string, URLGenerator> = {
  postgres: ({ user, password, host, port, db }: DBOptions) =>
    `postgresql://${user}:${password}@${host}:${port}/${db}`,
  redis: ({ password, host, port }: DBOptions) => {
    return password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`;
  },
};

interface DBOptions {
  host?: string;
  port?: string | number;
  password?: string;
  user?: string;
  db?: string;
}

export const createDBUrl = (type: 'postgres' | 'redis', options: DBOptions) => {
  const urlGenerator = URLGeneratorMap[type];

  return urlGenerator(options);
};

export const getRedisUrl = (options: DBOptions) =>
  createDBUrl('redis', options);

export const getPostgresUrl = (options: DBOptions) =>
  createDBUrl('postgres', options);
