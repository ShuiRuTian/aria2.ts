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


interface clientSendProperty {
    url: URL;
    requestInit: RequestInit;
    /**
     * if override, will use totally new parameter rather than default value
     * if mergeShadow, will add/replace the object's property, object or array could be replaced. However, body is an exception.
     * if mergeDeep, will add/replace the object's property recursly, only string\number could be reaplced.
     */
    mergeMode: 'override' | 'mergeShadow' | 'mergeDeep';
}

type clientBody = { [key: string]: string } | string

class client {
  constructor(url: URL | string, requestInit: RequestInit = {}, body: clientBody = {}) {
    if (typeof url === 'string') { this.defaultUrl = new URL(url); } else { this.defaultUrl = url; }
    this.defaultRequestInit = requestInit;
    this.defaultBody = body;
  }

    defaultUrl: URL;

    defaultRequestInit: RequestInit;

    defaultBody: clientBody;

    protected _send(clientProperty?: Partial<clientSendProperty>) {
      const url = clientProperty?.url ? clientProperty?.url : this.defaultUrl;
      let requestInit = clientProperty?.requestInit ? clientProperty?.requestInit : {};
      const mergeMode = clientProperty?.mergeMode ? clientProperty?.mergeMode : 'mergeShadow';
      switch (mergeMode) {
        case 'mergeShadow':
          const oriBodyFromRequestInit: { [key: string]: string } = this.defaultRequestInit.body === undefined ? {} : JSON.parse(this.defaultRequestInit.body?.toString());
          const oriBodyFromDefaultBody: { [key: string]: string } = typeof this.defaultBody === 'string' ? JSON.parse(this.defaultBody) : this.defaultBody;
          const oriBody: { [key: string]: string } = { ...oriBodyFromRequestInit, ...oriBodyFromDefaultBody };
          const newBody: { [key: string]: string } = requestInit?.body === undefined ? {} : JSON.parse(requestInit.body?.toString());
          requestInit = { ...this.defaultRequestInit, ...requestInit, body: JSON.stringify({ ...oriBody, ...newBody }) };
          break;
        case 'override':
          break;
        case 'mergeDeep':
          throw new Error('not impl');
      }
      return fetch(url, requestInit);
    }
}


const JsonRpcDefaultUrl = 'http://localhost:6800/jsonrpc';

const JsonRpcDefaultRequestInit: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'POST',
};

const JsonRpcDefaultBody: clientBody = {
  jsonrpc: '2.0',
};

type METHODS = 'aria2.addUri' | 'aria2.addTorrent' | 'aria2.getPeers' | 'aria2.addMetalink' | 'aria2.remove' | 'aria2.pause' | 'aria2.forcePause' | 'aria2.pauseAll' | 'aria2.forcePauseAll' | 'aria2.unpause' | 'aria2.unpauseAll' | 'aria2.forceRemove' | 'aria2.changePosition' | 'aria2.tellStatus' | 'aria2.getUris' | 'aria2.getFiles' | 'aria2.getServers' | 'aria2.tellActive' | 'aria2.tellWaiting' | 'aria2.tellStopped' | 'aria2.getOption' | 'aria2.changeUri' | 'aria2.changeOption' | 'aria2.getGlobalOption' | 'aria2.changeGlobalOption' | 'aria2.purgeDownloadResult' | 'aria2.removeDownloadResult' | 'aria2.getVersion' | 'aria2.getSessionInfo' | 'aria2.shutdown' | 'aria2.forceShutdown' | 'aria2.getGlobalStat' | 'aria2.saveSession' | 'system.multicall' | 'system.listMethods' | 'system.listNotifications'

interface Aria2RpcMethod {
    (...paras: any): Promise<any>;
}

type QQ = 'hello.wer';

export default class JsonRpcClient extends client implements Record<QQ, Aria2RpcMethod> {
    private Index = 0;

    private _methodSend(methodName: METHODS, paras: any) {
      const mutableBodyObject = {
        method: methodName,
        id: this.Index++,
      };
      const requestInfo: Partial<clientSendProperty> = {
        requestInit: {
          body: JSON.stringify(mutableBodyObject),
        },
      };
      return this.send();
    }

    addUri() {
    }

    'hello.wer'(q: string, w: string) {
      return fetch('');
    }

    constructor(url: URL | string = JsonRpcDefaultUrl, requestInit: RequestInit = JsonRpcDefaultRequestInit, body: clientBody = JsonRpcDefaultBody) {
      super(url, requestInit, body);
    }

    send(clientProperty?: Partial<clientSendProperty>) {
      return this._send(clientProperty);
    }
}
