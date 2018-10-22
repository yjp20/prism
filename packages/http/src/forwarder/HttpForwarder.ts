import { IForwarder, IPrismInput } from '@stoplight/prism-core';
import { IHttpOperation, IServer } from '@stoplight/types';
import axios from 'axios';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';

export class HttpForwarder
  implements IForwarder<IHttpOperation, IHttpRequest, IHttpConfig, IHttpResponse> {
  public async forward(opts: {
    resource?: IHttpOperation;
    // todo: IHttpRequest should be enough
    input: IPrismInput<IHttpRequest>;
  }): Promise<IHttpResponse> {
    if (!opts.resource) {
      throw new Error('Missing spec');
    }
    if (!opts.resource.servers || opts.resource.servers.length === 0) {
      throw new Error('Server list is missing in spec');
    }

    const inputData = opts.input.data;

    const response = await axios({
      method: inputData.method,
      url: this.resolveServerUrl(opts.resource.servers[0]) + inputData.url.path,
      params: inputData.url.query,
      responseType: 'text',
      data: inputData.body,
      headers: inputData.headers,
      validateStatus: () => true,
    });

    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.data,
    };
  }

  private resolveServerUrl(server: IServer) {
    if (!server.variables) {
      return server.url;
    }

    return server.url.replace(/{(.*?)}/g, (_match, variableName) => {
      const variable = server.variables![variableName];
      if (!variable) {
        throw new Error(`Variable '${variableName}' is not defined, cannot parse input.`);
      }

      return variable.default || variable.enum![0];
    });
  }
}
