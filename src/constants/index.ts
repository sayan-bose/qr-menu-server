export const __prod__ = process.env.NODE_ENV === 'production';
export const cookieName = 'qr-menu-qukey';
export const FORGET_PASSWORD_PREFIX = 'qr-menu-manage-password';

export const MAX_RETRY = 5;
export const RETRY_DELAY = 5000;

export const ERROR_MESSAGES: Record<string, string> = {
  SYSTEM_ERROR: 'Something went wrong!',
  UNAUTHORIZED: 'Unaunthorized',
  INVALID_REQUEST: 'Invaid Request'
};

export const ERROR_CODES = {
  DB: {
    UNIQUE_CONSTRAINT_ERROR: '23505'
  }
};

export const ITEM_TYPES = {
  VEG: 'veg',
  NON_VEG: 'non-veg',
  EGG: 'egg'
};
