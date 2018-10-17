import { IHttpOperation } from "@stoplight/types/http";
import { IServer } from "@stoplight/types";

export type Nullable<T> = T | null;

export interface IMatch {
  operation: IHttpOperation;
  matchingPair: [IServerMatch, IPathMatch];
}

export type MatchType = 'concrete' | 'templated';

export interface IServerMatch {
  baseUrl?: string;
  path: string;
  variables?: { name: string, value: string }[];
  server?: IServer;
}

export type IPathMatch = boolean | { name: string, value: string }[];

export type PathWithServers = { pathMatch: IPathMatch, matchingServers: IServerMatch[] };
