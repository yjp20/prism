import { dereference } from '@stoplight/json-schema-ref-parser';
import { decycle } from '@stoplight/json';

export async function dereferenceSpec(specFilePathOrObject: string | object, options?: { isDereferenced?: boolean }) {
  if (options?.isDereferenced && typeof specFilePathOrObject === 'object') {
    return specFilePathOrObject;
  }

  return decycle(
    await dereference(specFilePathOrObject, { dereference: { circular: 'ignore' }, continueOnError: false })
  );
}
