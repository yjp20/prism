import { Chance } from 'chance';
import { IHttpOperation, IHttpResponse } from '@stoplight/types/http';
const chance = new Chance();

export function anHttpOperation(givenHttpOperation?: IHttpOperation) {
  const httpOperation = givenHttpOperation || {
    method: chance.string(),
    path: chance.url(),
    responses: [],
    id: chance.string(),
  };
  return {
    instance() {
      return httpOperation;
    },
    withResponses(responses: IHttpResponse[]) {
      httpOperation.responses = responses;
      return this;
    }
  }
}
