import { Express } from 'express';
import cors from 'cors';

export const addCors = (app: Express) => {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
};
