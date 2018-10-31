import { createObjectFromKeyValList } from '../../helpers/createObjectFromKeyValList';
import { IHttpHeaderParamStyleDeserializer } from '../IHttpHeaderParamStyleDeserializer';

export class SimpleStyleDeserializer implements IHttpHeaderParamStyleDeserializer {
  public supports(style: string) {
    return style === 'simple';
  }

  public deserialize(value: string, type: string, explode: boolean): any {
    if (type === 'array') {
      return this.deserializeArray(value);
    } else if (type === 'object') {
      return explode ? this.deserializeImplodeObject(value) : this.deserializeObject(value);
    } else {
      return value;
    }
  }

  private deserializeArray(value: string) {
    return value === '' ? [] : value.split(',');
  }

  private deserializeImplodeObject(value: string) {
    return value.split(',').reduce((result: object, pair) => {
      const [k, v] = pair.split('=');
      return { ...result, [k]: v };
    }, {});
  }

  private deserializeObject(value: string) {
    return createObjectFromKeyValList(value.split(','));
  }
}
