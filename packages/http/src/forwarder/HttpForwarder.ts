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

    const response = await axios({
      method: opts.input.data.method,
      url: this.resolveServerUrl(opts.resource.servers[0]) + opts.input.data.url.path,
      params: opts.input.data.url.query,
      responseType: 'text',
      data: opts.input.data.body,
      headers: opts.input.data.headers,
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
