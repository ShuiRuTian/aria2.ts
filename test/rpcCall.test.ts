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

describe('JSON-RPC', () => {
  // describe('http', async () => {
  //   const client = new JsonRpcClient();
  //   const res = await client.listMethods();
  //   const jsonMessage = await res.json();
  //   console.log(jsonMessage);
  //   expect(Array.isArray(jsonMessage)).to.be.true;
  //   jsonMessage.forEach((element: any) => {
  //     expect(element).to.be.a('string');
  //   });
  // });

  describe('websocket', () => {
    describe('lowLevel websocket', () => {
      const socket = new WS('ws://localhost:6800/jsonrpc');
      const body = {
        jsonrpc: '2.0', id: 'qwer', method: 'aria2.addUri', params: [['ithub.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'], { dir: './' }],
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
  });
});
