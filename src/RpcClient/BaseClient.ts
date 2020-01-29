import fetch, { RequestInit } from 'node-fetch';
import { URL } from 'url';

/**
 * 1. client have default config, send each config with them
 * 2. might default config could be enumertable, such as JSON RPC, XMLRPC
 * 3. but part of them could change such as host:port.
 *
 * Methods to change mutable config.
 * send method support with mutable config and without them, if without, use setted config.
 *
 * each method should be supported.
 */


export interface ClientSendProperty {
    url: URL;
    requestInit: RequestInit;
    /**
     * if override, will use totally new parameter rather than default value
     * if mergeShadow, will add/replace the object's property, object or array could be replaced. However, body is an exception.
     * if mergeDeep, will add/replace the object's property recursly, only string\number could be reaplced.
     */
    mergeMode: 'override' | 'mergeShadow' | 'mergeDeep';
}

export type clientBody = { [key: string]: string } | string

export class BaseClient {
  constructor(url: URL | string, requestInit: RequestInit = {}, body: clientBody = {}) {
    if (typeof url === 'string') { this.defaultUrl = new URL(url); } else { this.defaultUrl = url; }
    this.defaultRequestInit = requestInit;
    this.defaultBody = body;
  }

    defaultUrl: URL;

    defaultRequestInit: RequestInit;

    defaultBody: clientBody;

    protected send(clientProperty?: Partial<ClientSendProperty>) {
      const url = clientProperty?.url ? clientProperty?.url : this.defaultUrl;
      let requestInit = clientProperty?.requestInit ? clientProperty?.requestInit : {};
      const mergeMode = clientProperty?.mergeMode ? clientProperty?.mergeMode : 'mergeShadow';
      switch (mergeMode) {
        case 'mergeShadow':
        {
          const oriBodyFromRequestInit: { [key: string]: string } = this.defaultRequestInit.body === undefined ? {} : JSON.parse(this.defaultRequestInit.body?.toString());
          const oriBodyFromDefaultBody: { [key: string]: string } = typeof this.defaultBody === 'string' ? JSON.parse(this.defaultBody) : this.defaultBody;
          const oriBody: { [key: string]: string } = { ...oriBodyFromRequestInit, ...oriBodyFromDefaultBody };
          const newBody: { [key: string]: string } = requestInit?.body === undefined ? {} : JSON.parse(requestInit.body?.toString());
          requestInit = { ...this.defaultRequestInit, ...requestInit, body: JSON.stringify({ ...oriBody, ...newBody }) };
          break;
        }
        case 'override':
          break;
        case 'mergeDeep':
          throw new Error('not impl');
        default:
          throw new Error('undefined type');
      }
      return fetch(url, requestInit);
    }
}
