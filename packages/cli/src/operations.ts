import { bundleOas3Service, bundleOas2Service, transformPostmanCollectionOperations } from '@stoplight/http-spec';
import { bundleTarget } from '@stoplight/json';
import { IHttpOperation, IBundledHttpService } from '@stoplight/types';
import { get, reduce } from 'lodash';
import type { Spec } from 'swagger-schema-official';
import type { OpenAPIObject } from 'openapi3-ts';
import type { CollectionDefinition } from 'postman-collection';
import { dereferenceSpec } from './util/dereference';

export async function getHttpOperationsFromSpec(
  specFilePathOrObject: string | object,
  options?: { isDereferenced?: boolean }
): Promise<IHttpOperation[]> {
  const result = await dereferenceSpec(specFilePathOrObject, options);

  let operations: IHttpOperation<true | false>[] = [];
  let components: IBundledHttpService['components'] | undefined;

  if (isOpenAPI2(result)) {
    const service = bundleOas2Service({ document: result });
    operations = service.operations;
    components = service.components;
  } else if (isOpenAPI3(result)) {
    const service = bundleOas3Service({ document: result });
    operations = service.operations;
    components = service.components;
  } else if (isPostmanCollection(result)) {
    operations = transformPostmanCollectionOperations(result);
  } else {
    throw new Error('Unsupported document format');
  }

  if (components) {
    // Map components array to object, so we can later use it for dereferencing
    const mappedComponents = reduce(
      components,
      (mappedComponentsObj, componentsArr, componentType) => {
        return {
          ...mappedComponentsObj,
          [componentType]: reduce(
            componentsArr,
            (mappedComponentObj, component, componentIndex) => {
              return {
                ...mappedComponentObj,
                [componentIndex]: component,
              };
            },
            {}
          ),
        };
      },
      {}
    );

    operations.forEach(op => {
      // @ts-expect-error "bundling" components onto each operation to easily dereference later
      op.components = mappedComponents;
    });
  } else {
    // Backwards compatibility
    operations.forEach((op, i, ops) => {
      ops[i] = bundleTarget({
        document: {
          ...result,
          __target__: {
            ...op,
          },
        },
        path: '#/__target__',
        cloneDocument: false,
      });
    });
  }

  return operations;
}

function isOpenAPI2(document: unknown): document is Spec {
  return get(document, 'swagger');
}

function isOpenAPI3(document: unknown): document is OpenAPIObject {
  return get(document, 'openapi');
}

function isPostmanCollection(document: unknown): document is CollectionDefinition {
  return Array.isArray(get(document, 'item')) && get(document, 'info.name');
}
