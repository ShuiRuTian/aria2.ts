/* eslint-disable no-unused-expressions */
import { URL } from 'url';
import fetch, { RequestInit } from 'node-fetch';
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { watchFile } from 'fs-extra';

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
    body: clientBody;
    /**
     * if override, will use totally new parameter rather than default value
     * if mergeShadow, will add/replace the object's property, object or array could be replaced. However, body is an exception.
     * if mergeDeep, will add/replace the object's property recursly, only string\number could be reaplced.
     */
    mergeMode: 'override' | 'mergeShadow' | 'mergeDeep';
}

export type clientBody = { [key: string]: string } | string

interface WebSocketPromise{
  resolvePromise: (resolveValue: any) => void;
  rejectPromise: (rejectReason: any) => void;
}


interface WebSocketEventMap {
  'close': CloseEvent;
  'error': Event;
  'message': MessageEvent;
  'open': Event;
}

export interface WebSocketPromiseResultFunction{
  getIdFromSentMessage: (message: string) => string;
  getIdFromReceivedMessage: (message: string) => string;
  resolvedCallback: (message: string) => any;
  rejectCallback: (message: string) => any;
  isPromiseSuccess: (message: string) => boolean;
}

/**
 * anti-corruption layer
 * shadow the details of implememnts of websocket and http request.
 *
 * extends EventEmitter, main purpose is to support websocket better. But not used now.
 *
 * transfer websocket from listener to promise.
 */

export class BaseClient extends EventEmitter {
  constructor(url: URL | string, wsHelper: WebSocketPromiseResultFunction, requestInit: RequestInit = {}, body: clientBody = {}) {
    super();
    if (typeof url === 'string') { this.defaultUrl = new URL(url); } else { this.defaultUrl = url; }
    this.defaultRequestInit = requestInit;
    this.defaultBody = body;
    this.getCorresponsdMessageId = wsHelper.getIdFromSentMessage;
    if (this.defaultUrl.protocol.startsWith('ws')) {
      this.sokcet = new WebSocket(this.defaultUrl);
      this.sokcet.addEventListener('message', ({ data: receivedMessage }) => {
        const messageId = wsHelper.getIdFromSentMessage(receivedMessage);
        const { websocketPromiseCollection } = this;
        const defferedPromise = websocketPromiseCollection[messageId];
        if (defferedPromise === undefined) throw new Error('this task not existed.');
        if (wsHelper.isPromiseSuccess(receivedMessage)) {
          const result = wsHelper.resolvedCallback(receivedMessage);
          defferedPromise.resolvePromise(result);
        } else {
          const reason = wsHelper.rejectCallback(receivedMessage);
          defferedPromise.rejectPromise(reason);
        }
      });
    }
  }

  // http

    protected defaultRequestInit: RequestInit;

    // websocket

    protected sokcet: WebSocket | undefined;

    private websocketPromiseCollection: {[key: string]: WebSocketPromise} = { };

    private getCorresponsdMessageId: (sentMessage: string) => string;

    addEventListenerForWebSocket<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => any): void;

    addEventListenerForWebSocket(type: string, listener: EventListenerOrEventListenerObject): void;

    addEventListenerForWebSocket(type: string, listener: any): void {
      // maybe we could record event linstener use current instance, so reconnect the websocket we could copy to the new one?
      if (this.sokcet === undefined) throw new Error('Please use websocket protocal to create client.');
      switch (type) {
        case 'close':
          this.sokcet.addEventListener(type, listener);
          break;
        case 'error':
          this.sokcet.addEventListener(type, listener);
          break;
        case 'message':
          this.sokcet.addEventListener(type, listener);
          break;
        case 'open':
          this.sokcet.addEventListener(type, listener);
          break;
        default:
          this.sokcet.addEventListener(type, listener);
      }
    }

    // general
    // for now, if user change url, websocket could not change, user has to create a new one.
    defaultUrl: URL;

    protected defaultBody: clientBody;

    protected async send(clientProperty?: Partial<ClientSendProperty>) {
      const url = clientProperty?.url ? clientProperty?.url : this.defaultUrl;
      const body = clientProperty?.body ? clientProperty?.body : {};
      const mergeMode = clientProperty?.mergeMode ? clientProperty?.mergeMode : 'mergeShadow';
      let fetchRequest: RequestInit|undefined;
      let websocketMessage = '';
      switch (mergeMode) {
        case 'mergeShadow':
        {
          const oriBodyFromRequestInit: { [key: string]: string } = this.defaultRequestInit.body === undefined ? {} : JSON.parse(this.defaultRequestInit.body?.toString());
          const oriBodyFromDefaultBody: { [key: string]: string } = typeof this.defaultBody === 'string' ? JSON.parse(this.defaultBody) : this.defaultBody;
          const oriBody: { [key: string]: string } = { ...oriBodyFromRequestInit, ...oriBodyFromDefaultBody };
          const newBody: { [key: string]: string } = typeof body === 'string' ? JSON.parse(body) : body;
          websocketMessage = JSON.stringify({ ...oriBody, ...newBody });
          break;
        }
        case 'override':
          break;
        case 'mergeDeep':
          throw new Error('not impl');
        default:
          throw new Error('undefined type');
      }
      if (this.sokcet?.readyState !== WebSocket.OPEN) {
        const response = await fetch(url, fetchRequest);
        return response.json();
      }
      this.sokcet.send(websocketMessage);
      return new Promise((resolve, reject) => {
        const messageId = this.getCorresponsdMessageId(websocketMessage);
        this.websocketPromiseCollection[messageId] = {
          resolvePromise: (para) => {
            resolve(para);
          },
          rejectPromise: (para) => {
            reject(para);
          },
        };
      });
    }
}
