import { Chance } from 'chance';
import { IHttpMethod } from "@stoplight/prism-http/types";

const chance = new Chance();
const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

export function pickOneHttpMethod(): IHttpMethod {
  return chance.pickone(httpMethods) as IHttpMethod;
}

export function pickSetOfHttpMethods(count: number = 2): IHttpMethod[] {
  return chance.unique(pickOneHttpMethod, count) as IHttpMethod[];
}

export function randomArray<T>(itemGenerator: () => T, length: number = 1): T[] {
  return new Array(length).fill(null).map(itemGenerator);
}

const defaultRandomPathOptions = {
  pathFragments: 3,
  includeTemplates: true,
  leadingSlash: true,
};

interface RandomPathOptions {
  pathFragments?: number;
  includeTemplates?: boolean;
  trailingSlash?: boolean;
  leadingSlash?: boolean;
}

export function randomPath(opts: RandomPathOptions = defaultRandomPathOptions): string {
  opts = Object.assign({}, defaultRandomPathOptions, opts);
  const randomPathFragments = randomArray(
    () => (opts.includeTemplates && chance.coin() === 'heads') ? `{${chance.word()}}` : chance.word(),
    opts.pathFragments
  );
  let leadingSlash = chance.pickone(['/', '']);
  let trailingSlash = chance.pickone(['/', '']);
  if (opts.leadingSlash !== undefined) {
    leadingSlash = opts.leadingSlash ? '/' : '';
  }
  if (opts.trailingSlash !== undefined) {
    trailingSlash = opts.trailingSlash ? '/' : '';
  }
  return `${leadingSlash}${randomPathFragments.join('/')}${trailingSlash}`
}
