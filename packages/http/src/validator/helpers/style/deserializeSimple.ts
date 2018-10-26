import { createObjectFromKeyValList } from './createObjectFromKeyValList';

export function deserializeSimple(value: string, type: string, explode: boolean = false): any {
  if (type === 'array') {
    return deserializeArray(value);
  } else if (type === 'object') {
    return explode ? deserializeImplodeObject(value) : deserializeObject(value);
  } else {
    return value;
  }
}

function deserializeArray(value: string) {
  return value === '' ? [] : value.split(',');
}

function deserializeImplodeObject(value: string) {
  return value.split(',').reduce((result: object, pair) => {
    const [k, v] = pair.split('=');
    return { ...result, [k]: v };
  }, {});
}

function deserializeObject(value: string) {
  return createObjectFromKeyValList(value.split(','));
}
