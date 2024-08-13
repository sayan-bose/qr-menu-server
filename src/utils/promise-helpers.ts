import { RETRY_DELAY } from '../constants';

export const sleep = (delay: number = RETRY_DELAY): Promise<any> => {
  return new Promise((res) => setTimeout(res, delay));
};
