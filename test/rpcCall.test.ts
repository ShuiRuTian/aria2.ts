/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */

import WS from 'ws';
import { expect } from 'chai';
import JsonRpcClient from '..';

// before(() => {
//   // TODO: judge whether there is aria2 in the file System.
//   // TODO: how to judge there is an aria2 running? how to get its information?
//   const aria2 = new Aria2();
// });
const downloadLink1 = 'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip';

describe('JSON-RPC', () => {
  it('http', async () => {
    const client = new JsonRpcClient();
    const res = await client.addUri([downloadLink1]);
    console.log(res);
    console.log(res);
  });

  describe('websocket', function () {
    it('lowLevel websocket', function () {
      const socket = new WS('ws://localhost:6800/jsonrpc');
      const body = {
        jsonrpc: '2.0', id: 'qwer', method: 'aria2.addUri', params: [[downloadLink1], { dir: './' }],
      };
      socket.addEventListener('open', ({ target }) => {
        console.log('open');
        console.log(target);
      });
      socket.addEventListener('message', ({ data, type, target }) => {
        console.log('message');
        console.log(data);
        console.log(type);
        console.log(target);
      });
      socket.addEventListener('error', ({
        error, message, type, target,
      }) => {
        console.log('error');
        console.log(error);
        console.log(message);
        console.log(type);
        console.log(target);
      });
      socket.addEventListener('close', ({
        wasClean, code, reason, target,
      }) => {
        console.log('close');
        console.log(wasClean);
        console.log(code);
        console.log(reason);
        console.log(target);
      });
      setTimeout(() => {
        console.log('timeout1');
        socket.send(JSON.stringify(body), (err) => {
          console.log('send');
          console.log(err);
        });
        setTimeout(() => {
          console.log('timeout2');
        }, 1000);
      }, 1000);
    });
    it('client as websocket return promise', async function () {
      const client = new JsonRpcClient('ws://localhost:6800/jsonrpc');
      const res = await client.addUri([downloadLink1], { dir: './' });
      console.log(res);
    });
    it('client as websocket recontinue by gid and use notification', async function () {
      const client = new JsonRpcClient('ws://localhost:6800/jsonrpc');
      client.notification('aria2.onDownloadStart', (res) => {
        console.log('start');
        console.log(res.gid);
      });
      client.notification('aria2.onDownloadPause', (res) => {
        console.log('pause');
        console.log(res.gid);
      });
      client.notification('aria2.onDownloadStop', (res) => {
        console.log('stop');
        console.log(res.gid);
      });
      const res = await client.addUri([downloadLink1], { dir: './' });
      console.log(res);
      const res1 = await client.pause(res);
      const res2 = await client.unpause(res1);
      setTimeout(() => {
        console.log('timeout2');
      }, 10000);
    });

    it('client as websocket recontinue by all and use notification', async function () {
      const client = new JsonRpcClient('ws://localhost:6800/jsonrpc');
      client.notification('aria2.onDownloadStart', (res) => {
        console.log('start');
        console.log(res.gid);
      });
      client.notification('aria2.onDownloadPause', (res) => {
        console.log('pause');
        console.log(res.gid);
      });
      client.notification('aria2.onDownloadStop', (res) => {
        console.log('stop');
        console.log(res.gid);
      });
      const res1 = await client.addUri([downloadLink1], { dir: './' });
      const res2 = await client.addUri([downloadLink1], { dir: './' });

      const ok1 = await client.pauseAll();
      const ok2 = await client.unpauseAll();
      setTimeout(() => {
        console.log('timeout3');
      }, 10000);
    });
  });
});
