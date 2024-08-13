export const prepareAndQuery = (name: string, data?: any): string =>
  prepareQuery(name, data, 'AND');

export const prepareOrQuery = (name: string, data?: any): string =>
  prepareQuery(name, data, 'OR');

export const prepareQuery = (
  name: string,
  data: any,
  operation: 'AND' | 'OR'
) => {
  let queryString = '';

  if (!data) {
    return '';
  }

  Object.keys(data).forEach((field) => {
    const value = data[field];
    if (value) {
      queryString = queryString
        ? `${queryString} ${operation} ${name}.${field} = :${field}`
        : `${name}.${field} = :${field}`;
    }
  });

  return queryString;
};
