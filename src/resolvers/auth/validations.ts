import * as yup from 'yup';

import { UserInput } from '../../modules/user/types';

import {
  emailRequired,
  passwordRequired,
  safeStringRequired,
  validateSchema
} from '../../validations';

export const userRegistrationSchema = () =>
  yup.object().shape({
    email: emailRequired(),
    password: passwordRequired(),
    first_name: safeStringRequired(),
    last_name: safeStringRequired()
  });

export const userLoginSchema = () =>
  yup.object().shape({
    email: emailRequired(),
    password: safeStringRequired()
  });

export const validateRegisterData = async (values: UserInput) => {
  return validateSchema(userRegistrationSchema, values);
};

export const validateLoginData = async (values: UserInput) => {
  return validateSchema(userLoginSchema, values);
};
