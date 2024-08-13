import { FieldError } from '../resolvers/auth';
import * as yup from 'yup';

export const requiredMessage = 'Required field';
export const safeStringMessage = 'Invalid input';
export const invalidFormat = 'Invalid format';

export const inputMaxCharsAmount = 126;
//const numberMaxCharsAmount = 20;
//const textareaMaxCharsAmount = 1000;
export const passwordCharsMinAmount = 8;
//const zipCodeLength = 5;
export const generalInputRegExp =
  /^((?![<;\\>])[\w\s()-`~@#$%^&*(),.!?-_=+[/\]{}|'’:”"/])*$/;
export const emailRegExp =
  /[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\.(a(?:[cdefgilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abdefghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delmnoqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|obi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p(?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\b){1,2}/;
// const passwordRegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9]/;

export const safeString = (msg = safeStringMessage) =>
  yup
    .string()
    .transform((value) => value?.trim()) //removes trailing and leading spaces
    .max(inputMaxCharsAmount)
    .matches(generalInputRegExp, msg);

export const safeStringRequired = (msg = requiredMessage) =>
  safeString().required(msg);

export const email = (msg = 'Invalid email format') =>
  yup.string().matches(emailRegExp, msg);

export const emailRequired = (msg = requiredMessage) => email().required(msg);

export const password = () =>
  yup
    .string()
    .min(
      passwordCharsMinAmount,
      `At least ${passwordCharsMinAmount} characters required.`
    );
/* .matches(
      passwordRegExp,
      "Password must contain: an uppercase letter, a number AND a special character (!, @, #, etc.)"
    ) */

export const passwordRequired = (msg = requiredMessage) =>
  password().required(msg);

export const validateSchema = (
  schema: any,
  values: any,
  options = {}
): null | FieldError[] => {
  const validator = typeof schema === 'function' ? schema() : schema;

  return validator
    .validate(values, options)
    .then(() => {
      return null;
    })
    .catch((e: yup.ValidationError): FieldError[] => {
      return [
        {
          field: e.path as string,
          message: e.errors[0],
        },
      ];
    });
};
