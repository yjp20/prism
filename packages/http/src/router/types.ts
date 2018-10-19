import { IHttpOperation } from '@stoplight/types/http';

export type Nullable<T> = T | null;

export interface IMatch {
  resource: IHttpOperation;
  serverMatch: MatchType | null;
  pathMatch: MatchType;
}

export enum MatchType {
  CONCRETE = 'concrete',
  TEMPLATED = 'templated',
  NOMATCH = 'no-match',
}
