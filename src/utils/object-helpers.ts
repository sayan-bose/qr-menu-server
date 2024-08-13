export const isBoolean = (value: any) => typeof value === 'boolean';

export const removeNull = (object: Record<string, any>) => {
  return !object
    ? object
    : Object.keys(object).reduce((prev, curr) => {
        let val = object[curr];
        if (val || isBoolean(val)) {
          if (typeof val === 'object') {
            val = Array.isArray(val) ? val : removeNull(val);
          }
          return { ...prev, [curr]: val };
        }
        return prev;
      }, {});
};
