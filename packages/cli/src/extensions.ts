import { get, camelCase, forOwn } from 'lodash';
import * as jsf from 'json-schema-faker';
import { dereferenceSpec } from './util/dereference';

export async function configureExtensionsFromSpec(
  specFilePathOrObject: string | object,
  options?: { isDereferenced?: boolean }
): Promise<void> {
  const result = await dereferenceSpec(specFilePathOrObject, options);

  forOwn(get(result, 'x-json-schema-faker', {}), (value: any, option: string) => {
    if (option === 'locale') {
      // necessary as workaround broken types in json-schema-faker
      // @ts-ignore
      return jsf.locate('faker').setLocale(value);
    }

    // necessary as workaround broken types in json-schema-faker
    // @ts-ignore
    jsf.option(camelCase(option), value);
  });
}
