export const prepareFieldErrors = (error: any, field: string): any => {
  if (error.code === '23505' || error.detail.includes('already exists')) {
    return {
      errors: [
        {
          field,
          message: 'Menu already exists'
        }
      ]
    };
  }
};

interface FieldError {
  field: string;
  message: string;
}

export const createFieldError = (
  field: string,
  message: string = 'Invalid field'
): FieldError[] => [
  {
    field,
    message
  }
];
