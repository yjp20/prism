import { IHttpOperation } from "@stoplight/types/http";

// returns true if matched concrete
// returns false if not matched
// returns path param values if matched templated
export function matchPath(requestPath: string, operation: Partial<IHttpOperation>): boolean | [ { name: string, value: string } ] {
  throw new Error('not implemented');
}
