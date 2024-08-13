import { connectDB } from './database';
import { createApp } from './app';
import { registerEnumType } from 'type-graphql';
import { SessionStatus } from '../types';

export const start = async () => {
  registerEnumType(SessionStatus, {
    name: 'SessionStatus',
    description: 'Type of session response'
  });

  /**
   * wait for db connection to eastablish
   */
  await connectDB();

  /**
   * create express app with apollo server
   */
  createApp();
};
