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

export interface PromiseResultFunction{
  isResponseTreatedAsPromise: (message: string) => boolean;
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
export class BaseClient // extends EventEmitter
// eslint-disable-next-line brace-style
{
  constructor(url: URL | string, promiseHelper: PromiseResultFunction, requestInit: RequestInit = {}, body: clientBody = {}) {
    // super();
    if (typeof url === 'string') { this.defaultUrl = new URL(url); } else { this.defaultUrl = url; }
    this.defaultRequestInit = requestInit;
    this.defaultBody = body;
    this.getCorresponsdMessageId = promiseHelper.getIdFromSentMessage;
    // eslint-disable-next-line no-underscore-dangle
    this._promiseHelper = promiseHelper;
    if (this.defaultUrl.protocol.startsWith('ws')) {
      this.sokcet = new WebSocket(this.defaultUrl);
      this.sokcet.addEventListener('open', () => {
        while (this.websocketWaitingMessageQueue.length !== 0) {
          const message = this.websocketWaitingMessageQueue.shift();
          this.sokcet?.send(message);
        }
      });
      this.sokcet.addEventListener('message', ({ data: receivedMessage }) => {
        if (!promiseHelper.isResponseTreatedAsPromise(receivedMessage)) { return; }
        const messageId = promiseHelper.getIdFromSentMessage(receivedMessage);
        const { websocketPromiseCollection } = this;
        const defferedPromise = websocketPromiseCollection[messageId];
        if (defferedPromise === undefined) throw new Error('this task not existed.');
        if (promiseHelper.isPromiseSuccess(receivedMessage)) {
          const result = promiseHelper.resolvedCallback(receivedMessage);
          defferedPromise.resolvePromise(result);
        } else {
          const reason = promiseHelper.rejectCallback(receivedMessage);
          defferedPromise.rejectPromise(reason);
        }
      });
    }
  }

  // http

    protected defaultRequestInit: RequestInit;

    // websocket

    protected sokcet: WebSocket | undefined;

    // if websocket want to send some message, but the state is connecting, the message will be pushed into this struct. When socket opens, the message would be sent one by one.
    private websocketWaitingMessageQueue: string[] = [];

    // sent message warpped in Promise waitting to resolve or reject.
    private websocketPromiseCollection: {[key: string]: WebSocketPromise} = { };

    private getCorresponsdMessageId: (sentMessage: string) => string;

    // return unsubscriber.
    addEventListenerForWebSocket<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => any): () => void;

    // return unsubscriber.
    addEventListenerForWebSocket(type: string, listener: EventListenerOrEventListenerObject): () => void;

    addEventListenerForWebSocket(type: string, listener: any): () => void {
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
      return () => {
        this.sokcet?.removeEventListener(type, listener);
      };
    }

    // general
    // for now, if user change url, websocket could not change, user has to create a new one.
    defaultUrl: URL;

    // this would only be used to deal with fetch result to have similar behaviour as websocket to produce same return.
    // this might no be right in concept: we could do this because aria2 return websocket and http request in the same structure, but this should not expose to this layer.
    private _promiseHelper: PromiseResultFunction

    protected defaultBody: clientBody;

    protected async send(clientProperty?: Partial<ClientSendProperty>) {
      const url = clientProperty?.url ? clientProperty?.url : this.defaultUrl;
      const body = clientProperty?.body ? clientProperty?.body : {};
      const mergeMode = clientProperty?.mergeMode ? clientProperty?.mergeMode : 'mergeShadow';
      let fetchRequest: RequestInit|undefined;
      let messageBody = '';
      switch (mergeMode) {
        case 'mergeShadow':
        {
          const oriBodyFromRequestInit: { [key: string]: string } = this.defaultRequestInit.body === undefined ? {} : JSON.parse(this.defaultRequestInit.body?.toString());
          const oriBodyFromDefaultBody: { [key: string]: string } = typeof this.defaultBody === 'string' ? JSON.parse(this.defaultBody) : this.defaultBody;
          const oriBody: { [key: string]: string } = { ...oriBodyFromRequestInit, ...oriBodyFromDefaultBody };
          const newBody: { [key: string]: string } = typeof body === 'string' ? JSON.parse(body) : body;
          messageBody = JSON.stringify({ ...oriBody, ...newBody });
          fetchRequest = { ...this.defaultRequestInit, body: messageBody };
          break;
        }
        case 'override':
          break;
        case 'mergeDeep':
          throw new Error('not impl');
        default:
          throw new Error('undefined type');
      }
      if (this.sokcet === undefined) {
        const response = await fetch(url, fetchRequest);
        const receivedMessage = await response.text();
        // do something similar to websocket response, to have the same behaviour.
        // eslint-disable-next-line no-underscore-dangle
        const promiseHelper = this._promiseHelper;
        return new Promise((resolve, reject) => {
          if (!promiseHelper.isResponseTreatedAsPromise(receivedMessage)) { return; }
          const messageId = promiseHelper.getIdFromSentMessage(receivedMessage);
          if (promiseHelper.isPromiseSuccess(receivedMessage)) {
            const result = promiseHelper.resolvedCallback(receivedMessage);
            resolve(result);
          } else {
            const reason = promiseHelper.rejectCallback(receivedMessage);
            reject(reason);
          }
        });
      }
      if (this.sokcet.readyState !== WebSocket.OPEN) {
        this.websocketWaitingMessageQueue.push(messageBody);
      } else {
        this.sokcet.send(messageBody);
      }
      return new Promise((resolve, reject) => {
        const messageId = this.getCorresponsdMessageId(messageBody);
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
