import * as yup from 'yup';
import { getYear, isValid, isBefore, isEqual, getMonth } from 'date-fns';

const minPassCharCount = 'A minium of 8 characters';
const anUpperCaseLetter = 'An UPPERCASE letter';
const aLowerCaseLetter = 'A lowercase letter';
const aNumberOrSymbol = 'A number or symbol';

export const newPassRequirements: string[] = [
  minPassCharCount,
  anUpperCaseLetter,
  aLowerCaseLetter,
  aNumberOrSymbol,
];

export const requiredMessage = 'Required field';
export const safeStringMessage = 'Safe text required';
export const invalidRegexMessage = 'Invalid Format';
export const phoneRegexMessage = 'Phone number is not valid';

const inputMaxCharsAmount = 126;
const numberMaxCharsAmount = 20;
const passwordCharsMinAmount = 8;
const zipCodeLength = 5;

const generalInputRegExp =
  /^((?![<;\\>])[\w\s()-`~@#$%^&*(),.!?-_=+[/\]{}|'’:”"/])*$/;
const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9]/;
const zipcodeRegExp = /^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$/;
const creditCardNumberRegExp =
  /^((4\d{3})|(5[1-5]\d{2})|(6011))-?\d{4}-?\d{4}-?\d{4}|3[4,7]\d{13}$/;
const creditCardCVVRegExp = /^([0-9]{3,4})$/;
const cardExpiry = /^(0[1-9]|1[0-2]|[1-9])\/(1[4-9]|[2-9][0-9]|20[1-9][1-9])$/;

/**
 * Valid phone number formats as per this regex
 * 123-456-7890
 * (123) 456-7890
 * 123 456 7890
 * 123.456.7890
 * +91 (123) 456-7890
 * Regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
 */
const phoneRegExp = /\(+([0-9]){3}\)+\s([0-9]){3}-([0-9]){4}/;

export const safeString = (msg = safeStringMessage) =>
  yup
    .string()
    .transform((value) => value?.trim()) //removes trailing and leading spaces
    .max(inputMaxCharsAmount)
    .matches(generalInputRegExp, msg);

export const safeStringRequired = (msg = requiredMessage) =>
  safeString().required(msg);

export const shortSafeString = () => safeString().max(numberMaxCharsAmount);
export const shortSafeStringRequired = () =>
  shortSafeString().required(requiredMessage);

export const password = () =>
  yup
    .string()
    .min(
      passwordCharsMinAmount,
      `At least ${passwordCharsMinAmount} characters required.`
    )
    .matches(
      passwordRegExp,
      'Password must contain: an uppercase letter, a number AND a special character (!, @, #, etc.)'
    );

export const passwordRequired = (msg = requiredMessage) =>
  password().required(msg);

// returns an array of all the errors
export const validate = (value: string) => {
  const schema = newPassword();

  try {
    schema.validateSync(value, { abortEarly: false });
  } catch (e) {
    if (e.name !== 'ValidationError') {
      throw e;
    }
    return e.inner.map(({ errors }: any) => errors[0]);
  }
  return null;
};

export const newPassword = () =>
  yup
    .string()
    .required(requiredMessage)
    .min(passwordCharsMinAmount, minPassCharCount)
    .matches(RegExp('(.*[A-Z].*)'), anUpperCaseLetter)
    .matches(RegExp('(.*[a-z].*)'), aLowerCaseLetter)
    .matches(RegExp('(?=.*[0-9])|(?=.*[!@#$%^&*])'), aNumberOrSymbol);

export const email = (msg = 'Invalid Email Address') => {
  return yup.string().matches(emailRegExp, msg);
};

export const emailRequired = () => email().required(requiredMessage);

export const phoneNumber = () =>
  yup.string().matches(phoneRegExp, phoneRegexMessage);

export const phoneNumberRequired = () =>
  phoneNumber().required(requiredMessage);

const isValidDOB: yup.TestFunction<Date | undefined, Record<string, any>> = (
  value
): boolean => {
  if (value) {
    // const dateFormat = '"mm/dd/yyyy"';
    const today = new Date();
    // const date = value;
    const minYear = 1900;
    const dobYear = getYear(value);

    return (
      isValid(value) &&
      dobYear > minYear &&
      (isBefore(value, today) || isEqual(value, today))
    );
  }
  return false;
};

export const dateOfBirth = (msg = 'Invalid Date format') => {
  return yup.date().test('date_of_birth', msg, isValidDOB);
};

export const dateOfBirthRequired = (msg = 'Invalid Date format') =>
  yup.date().required(requiredMessage).test('date_of_birth', msg, isValidDOB);

declare module 'yup' {
  interface ArraySchema<T> {
    unique(message?: string, mapper?: (a: T) => T): ArraySchema<T>;
  }
}

yup.addMethod(
  yup.array,
  'unique',
  function (message = 'Not a unique value', mapper = (a: any) => a) {
    return this.test('unique', message, function (list = []) {
      const set = Array.from(new Set(list.map(mapper)));
      const isUnique = list.length === set.length;

      if (isUnique) {
        return true;
      }

      const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
      return this.createError({
        path: `${this.path}[${idx}]`,
        message,
      });
    });
  }
);

export const uniqueArray = (msg: string) => {
  return yup.array().of(safeString()).unique(msg);
};

export const zipcode = (msg = 'Invalid Zip Code') =>
  yup
    .string()
    .length(zipCodeLength, msg)
    .matches(zipcodeRegExp, { message: invalidRegexMessage });

export const zipcodeRequired = () => zipcode().required(requiredMessage);

export const regexMatchRequired = (
  pattern: RegExp,
  msg = invalidRegexMessage
) => yup.string().matches(pattern, msg).required(requiredMessage);

const isValidExpiry: yup.TestFunction<
  string | undefined,
  Record<string, any>
> = (value): boolean => {
  if (value) {
    const today = new Date();
    const [month, year] = value?.split('/');

    const expiryYear = parseInt(`20${year}`);
    const currentYeart = getYear(today);

    if (expiryYear > currentYeart) {
      return true;
    } else if (expiryYear === currentYeart) {
      return parseInt(month) >= getMonth(today) + 1;
    }
  }

  return false;
};

export const expirationDate = (msg = 'Invalid expiry date') =>
  regexMatchRequired(cardExpiry, msg).test(
    'expiration_date',
    msg,
    isValidExpiry
  );

export const securityCode = () =>
  regexMatchRequired(creditCardCVVRegExp, 'Invalid cvv format');

export const cardNumber = () =>
  yup
    .string()
    .transform((_, original) => original && original.replace(/\s*/g, ''))
    .matches(creditCardNumberRegExp, 'Invalid number')
    .required(requiredMessage);
